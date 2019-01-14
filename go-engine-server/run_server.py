#!/usr/bin/env python
from __future__ import print_function
import yaml

import tensorflow as tf
from keras.models import model_from_yaml
from go.kerasimpl import BotProcessor
from go.rest import FlaskWebServer


model_file = 'model_output/model.yml'
weight_file = 'model_output/weights.hd5'


with open(model_file, 'r') as f:
    yml = yaml.load(f)
    model = model_from_yaml(yaml.dump(yml))
    model.compile(loss='categorical_crossentropy', optimizer='adadelta', metrics=['accuracy'])
    model.load_weights(weight_file)
    graph = tf.get_default_graph()

bot_processor = BotProcessor(model=model)
web_server = FlaskWebServer(bot=bot_processor, graph=graph, port=8080)
web_server.run()
