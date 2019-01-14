from __future__ import print_function
from keras.models import Sequential
from keras.utils import np_utils
from model.model_config import ModelConfig
from model.indexer import FileIndexer

if __name__ == "__main__":

    processor = FileIndexer()

    X, y = processor.start_process(num_samples=1000)
    X = X.astype('float32')
    Y = np_utils.to_categorical(y, 19 * 19)

    model = Sequential()
    modelc = ModelConfig(
        128,
        1,
        361,
        32,
        2,
        3,
        7,
        'categorical_crossentropy',
        'adadelta'
    )

    model = modelc.model_config(model)
    model = modelc.model_compile(model)

    model.fit(X, Y, batch_size=modelc.batch_size, epochs=modelc.epoch, verbose=1)

    weight_file = '../model_output/weights.hd5'
    model.save_weights(weight_file, overwrite=True)

    model_file = '../model_output/model.yml'
    with open(model_file, 'w') as yml:
        model_yaml = model.to_yaml()
        yml.write(model_yaml)
