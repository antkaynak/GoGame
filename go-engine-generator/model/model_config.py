from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.layers.convolutional import Conv2D, MaxPooling2D


class ModelConfig(object):

    def __init__(self, batch_size, epoch, classes, filters, pool, kernel, planes,
                 loss, optimizer):
        self.batch_size = batch_size
        self.epoch = epoch
        self.classes = classes
        self.filters = filters
        self.pool = pool
        self.kernel = kernel
        self.planes = planes
        self.loss = loss
        self.optimizer = optimizer

    def model_config(self, model):
        model.add(Conv2D(self.filters, self.kernel, self.kernel, border_mode='valid',
                                input_shape=(self.planes, 19, 19)))
        model.add(Activation('relu'))
        model.add(Conv2D(self.filters, self.kernel, self.kernel))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(self.pool, self.pool)))
        model.add(Dropout(0.2))
        model.add(Flatten())
        model.add(Dense(256))
        model.add(Activation('relu'))
        model.add(Dropout(0.5))
        model.add(Dense(self.classes))
        model.add(Activation('softmax'))
        return model

    def model_compile(self, model):
        model.compile(loss=self.loss,
                      optimizer=self.optimizer,
                      metrics=['accuracy'])
        return model


