
from flask import Flask, request, jsonify
from flask_cors import CORS


class FlaskWebServer(object):

    def __init__(self, bot, graph, port=8080):
        self.bot = bot
        self.graph = graph
        self.port = port

    def run(self):
        app = Flask(__name__)
        CORS(app, resources={r"/prediction/*": {"origins": "*"}})
        self.app = app

        @app.route('/prediction', methods=['GET', 'POST'])
        def predict_move():
            # It is a good practice to use as_default even if
            # you do not work with many tensorflow graphs.
            with self.graph.as_default():
                content = request.json
                go_board = content['bodyArray']
                color = content['color']

                move_array = self.bot.model_predict(color, go_board)
                result = {}
                for index, res in enumerate(move_array):
                    result[index] = {'x': res[1], 'y': res[0]}

                print(result)
                json_result = jsonify(result)
                print(json_result)
                return json_result

        self.app.run(host='0.0.0.0', port=self.port, debug=True, use_reloader=False)


