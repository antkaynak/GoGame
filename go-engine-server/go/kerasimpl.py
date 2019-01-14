from __future__ import absolute_import
from __future__ import print_function
import copy
import random
from itertools import chain, product

import numpy as np
from six.moves import range


class BotProcessor:

    def __init__(self, model, top=10):
        self.model = model
        self.top = top

    def model_predict(self, bot_color, go_board):
        moves = self.calc_model_chain(bot_color, go_board)
        move_array = []
        for move in moves:
            move_array.append(move)
        return move_array

    def calc_model_chain(self, bot_color, go_board):
        return chain(
            self.calc_model(bot_color, go_board),
            self.gen_random(self.get_all_empty(go_board)),
        )

    def calc_model(self, bot_color, go_board):
        # 0, 0 is for generating the label.
        X, label = self.set_ready(
            bot_color, (0, 0), go_board, 7)

        X = X.reshape((1, X.shape[0], X.shape[1], X.shape[2]))

        # Generate bot move.
        model_pred = self.model.predict(X)
        score = self.model.evaluate(X, model_pred, verbose=0)
        print(score)
        # Remove single-dimensional entries from the shape of an array.
        # squeeze the prediction to 1d array so we can handpick and make predictions
        pred = np.squeeze(model_pred)
        # Argsort and get top 10 predictions
        top_n_pred_idx = pred.argsort()[-self.top:][::-1]
        print(len(top_n_pred_idx))
        for idx in top_n_pred_idx:
            prediction = int(idx)
            print(prediction)
            pred_row = prediction // 19
            pred_col = prediction % 19
            pred_move = (pred_row, pred_col)
            yield pred_move

    def model_evaluate(self, x, y):
        score = self.model.evaluate(x, y, verbose=0)
        print(score)
        return score

    def set_ready(self, color, move, go_board, num_planes):
        row, col = move
        if color == "WHITE":
            enemy_color = "BLACK"
        else:
            enemy_color = "WHITE"

        label = row * 19 + col
        move_array = np.zeros((num_planes, 19, 19))
        for row in range(0, 19):
            for col in range(0, 19):
                pos = (row, col)
                if go_board[pos[0]][pos[1]]["type"] == color:
                    if len(go_board[pos[0]][pos[1]]["group"]["liberties"]) == 1:
                        move_array[0, row, col] = 1
                    elif len(go_board[pos[0]][pos[1]]["group"]["liberties"]) == 2:
                        move_array[1, row, col] = 1
                    elif len(go_board[pos[0]][pos[1]]["group"]["liberties"]) >= 3:
                        move_array[2, row, col] = 1
                if go_board[pos[0]][pos[1]]["type"] == enemy_color:
                    if len(go_board[pos[0]][pos[1]]["group"]["liberties"]) == 1:
                        move_array[3, row, col] = 1
                    elif len(go_board[pos[0]][pos[1]]["group"]["liberties"]) == 2:
                        move_array[4, row, col] = 1
                    elif len(go_board[pos[0]][pos[1]]["group"]["liberties"]) >= 3:
                        move_array[5, row, col] = 1
                if len(go_board[pos[0]][pos[1]]["group"]["liberties"]) == 0:
                    move_array[6, row, col] = 1
        return move_array, label

    def gen_random(self, point_list):
        point_list = copy.copy(point_list)
        random.shuffle(point_list)
        for candidate in point_list:
            yield candidate

    def get_all_empty(self, board):
        empty_points = []
        for point in product(list(range(19)), list(range(19))):
            if board[point[0]][point[1]]["type"] == "EMPTY":
                empty_points.append(point)
        return empty_points
