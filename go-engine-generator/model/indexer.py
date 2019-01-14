# This Source Code Form is subject to the terms of the Mozilla Public License,
# v. 2.0. If a copy of the MPL was not distributed with this file, You can
# obtain one at http://mozilla.org/MPL/2.0/.
from __future__ import print_function
from __future__ import absolute_import
import os

import glob
import os.path
import gzip
import shutil
import tarfile
import numpy as np
import random
import multiprocessing
from os import sys

from os import listdir
from os.path import isfile, join

from lib.gosgf.sgf import Sgf_game
from lib.goboard.goboard import GoBoard


class FileIndexer(object):

    def __init__(self, data_directory='data'):
        self.data_dir = data_directory

    def start_process(self, num_samples=1000):
        samples = self.draw_training_samples(num_samples)
        self.start_child_process('train', samples)
        features_and_labels = self.sign_files('train', samples)
        return features_and_labels

    def start_child_process(self, name, samples):
        zip_names = set()
        indices_by_zip_name = {}
        for filename, index in samples:
            print(index)
            zip_names.add(filename)
            if filename not in indices_by_zip_name:
                indices_by_zip_name[filename] = []
            indices_by_zip_name[filename].append(index)

        print("********************")
        print(indices_by_zip_name)
        print(len(samples))
        print("********************")

        zips_to_process = []
        for zip_name in zip_names:
            base_name = zip_name.replace('.tar.gz', '')
            data_file_name = base_name + name
            if not os.path.isfile(self.data_dir + '/' + data_file_name):
                zips_to_process.append((self.__class__, self.data_dir,  zip_name,
                                        data_file_name, indices_by_zip_name[zip_name]))

        print("********************")
        print(zips_to_process)
        print("********************")

        cores = multiprocessing.cpu_count()
        pool = multiprocessing.Pool(processes=cores)
        p = pool.map_async(child_process, zips_to_process)
        try:
            results = p.get(0xFFFF)
            print(results)
        except KeyboardInterrupt:
            print("Caught KeyboardInterrupt, terminating workers")
            pool.terminate()
            pool.join()
            sys.exit(-1)

    def sign_files(self, name, samples):
        files_needed = set(file_name for file_name, index in samples)
        file_names = []
        for zip_file_name in files_needed:
            file_name = zip_file_name.replace('.tar.gz', '') + name
            file_names.append(file_name)
        feature_list = []
        label_list = []
        for file_name in file_names:
            file_prefix = file_name.replace('.tar.gz', '')
            feature_base = self.data_dir + '/' + file_prefix + '_features_*.npy'
            for feature_file in glob.glob(feature_base):
                X = np.load(feature_file)
                feature_list.append(X)
            label_base = self.data_dir + '/' + file_prefix + '_labels_*.npy'
            for label_file in glob.glob(label_base):
                y = np.load(label_file)
                label_list.append(y)

        features = np.concatenate(feature_list, axis=0)
        labels = np.concatenate(label_list, axis=0)

        feature_file = self.data_dir + '/' + str(7) + '_plane_features_' + name
        label_file = self.data_dir + '/' + str(7) + '_plane_labels_' + name

        np.save(feature_file, features)
        np.save(label_file, labels)

        return features, labels

    def set_file_info(self):
        onlyfiles = [f for f in listdir("data") if isfile(join("data", f))]
        file_info = []
        for item in onlyfiles:
            filename = item
            split_file_name = filename.split('-')
            num_games = int(split_file_name[len(split_file_name) - 2])
            file_info.append({'filename': filename, 'num_games': num_games})
        return file_info

    def draw_samples(self, num_sample_games):
        available_games = []
        for fileinfo in self.set_file_info():
            filename = fileinfo['filename']
            num_games = fileinfo['num_games']
            for i in range(num_games):
                available_games.append((filename, i))
        sample_set = set()
        while len(sample_set) < num_sample_games:
            sample = random.choice(available_games)
            if sample not in sample_set:
                sample_set.add(sample)
        return list(sample_set)

    def compute_test_samples(self, number_of_samples=100):
        if not os.path.isfile('test_samples.py'):
            test_games = self.draw_samples(number_of_samples)
            test_sample_file = open('test_samples.py', 'w')
            for sample in test_games:
                test_sample_file.write(str(sample) + "\n")
            test_sample_file.close()

        test_sample_file = open('test_samples.py', 'r')
        sample_contents = test_sample_file.read()
        test_sample_file.close()
        test_games = []
        for line in sample_contents.split('\n'):
            if line != "":
                (filename, index) = eval(line)
                test_games.append((filename, index))

        return test_games

    def draw_training_samples(self, num_sample_games):
        random.seed(1000)
        test_games = self.compute_test_samples()
        available_games = []
        for fileinfo in self.set_file_info():
            filename = fileinfo['filename']
            numgames = fileinfo['num_games']
            for i in range(numgames):
                available_games.append((filename, i))
        sample_set = set()
        while len(sample_set) < num_sample_games:
            sample = random.choice(available_games)
            if sample not in test_games:
                sample_set.add(sample)
        return list(sample_set)

    def process_zip(self, dir_name, zip_file_name, data_file_name, game_list):
        this_gz = gzip.open(dir_name + '/' + zip_file_name)
        this_tar_file = zip_file_name[0:-3]
        this_tar = open(dir_name + '/' + this_tar_file, 'wb')
        shutil.copyfileobj(this_gz, this_tar)
        this_tar.close()
        this_zip = tarfile.open(dir_name + '/' + this_tar_file)
        name_list = this_zip.getnames()
        total_examples = 0
        for index in game_list:
            name = name_list[index + 1]
            if name.endswith('.sgf'):
                content = this_zip.extractfile(name).read()
                sgf = Sgf_game.from_string(content)
                sgf, go_board_no_handy = sgf, GoBoard(19)
                go_board, first_move_done = self.get_handicap(go_board_no_handy, sgf)

                num_moves = 0
                for item in sgf.main_sequence_iter():
                    color, move = item.get_move()
                    if color is not None and move is not None:
                        if first_move_done:
                            num_moves = num_moves + 1
                        first_move_done = True
                total_examples = total_examples + num_moves
            else:
                raise ValueError(name + ' is not a valid sgf')

        features = np.zeros((total_examples, 7, 19, 19))
        labels = np.zeros((total_examples,))
        counter = 0
        for index in game_list:
            name = name_list[index + 1]
            if name.endswith('.sgf'):
                sgf_content = this_zip.extractfile(name).read()
                sgf = Sgf_game.from_string(sgf_content)
                go_board_no_handy = GoBoard(19)
                go_board, first_move_done = self.get_handicap(go_board_no_handy, sgf)
                for item in sgf.main_sequence_iter():
                    color, move = item.get_move()
                    if color is not None and move is not None:
                        row, col = move
                        if first_move_done:
                            X, y = go_board.feature_and_label(color, move, go_board, 7)
                            features[counter] = X
                            labels[counter] = y
                            counter += 1
                        go_board.apply_move(color, (row, col))
                        first_move_done = True
            else:
                raise ValueError(name + ' is not a valid sgf')

        feature_file_base = dir_name + '/' + data_file_name + '_features_%d'
        label_file_base = dir_name + '/' + data_file_name + '_labels_%d'

        chunk = 0
        chunksize = 1024
        while features.shape[0] >= chunksize:
            feature_file = feature_file_base % chunk
            label_file = label_file_base % chunk
            chunk += 1
            cur_features, features = features[:chunksize], features[chunksize:]
            cur_labels, labels = labels[:chunksize], labels[chunksize:]
            np.save(feature_file, cur_features)
            np.save(label_file, cur_labels)

    def get_handicap(self, go_board, sgf):
        ''' Get handicap stones '''
        first_move_done = False
        if sgf.get_handicap() != None and sgf.get_handicap() != 0:
            for setup in sgf.get_root().get_setup_stones():
                for move in setup:
                    go_board.apply_move('b', move)
            first_move_done = True
        return go_board, first_move_done


def child_process(jobinfo):
    try:
        clazz, dir_name, zip_file, data_file_name, game_list = jobinfo
        clazz(dir_name).process_zip(dir_name, zip_file, data_file_name, game_list)
    except (KeyboardInterrupt, SystemExit):
        raise Exception('>>> Exiting child process.')



