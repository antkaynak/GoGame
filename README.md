# Go Game with AI

A full-stack web application to demonstrate how a convolutional neural network works with a fun game, Go!

This project is an implementation of [BetaGo](https://github.com/maxpumperla/betago) and uses its libraries to generate and serve
a model to predict moves.

The web client is written in Angular 7.

![Go game](https://github.com/antkaynak/GoGame/blob/master/gogame.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

If you are on a Windows machine, the only available Tensorflow python library is 64-bit Python 3.5.x or Python 3.6.x.
The python 3 packages are listed in the requirements.txt file.
For the frontend Angular 7 you should install the latest release Node.

```
For the generate model and serve model backends use the command below in each directory.
pip install -r /path/to/requirements.txt

```

## Built With

* [Tensorflow](https://www.tensorflow.org/) - Keras backend implementation
* [Keras](https://keras.io/) - Convolutional neural network implementation
* [Python 3](https://www.python.org/) - Backend programming language
* [Flask](http://flask.pocoo.org/) - Backend Http Server to serve the model
* [BetaGo](https://github.com/maxpumperla/betago) - SGF library files, tar extraction and model generation
* [Angular](https://angular.io/) - Web Client frontend
* [Angular Material](https://material.angular.io/) - Web UI Components


## Contributing

If you want to contribute to this project you can email me at antkaynak1@gmail.com or you can pull a request.

## Versioning

This project does not have versioning and made with learning purposes.

## Authors

* **Ant Kaynak** - *Initial work* - [antkaynak](https://github.com/antkaynak)


## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/antkaynak/GoGame/blob/master/LICENSE) file for details

## Acknowledgments

* Huge thanks to the developers and contributers at BetaGo for making this project possible.
* This project is part of my Design Project I course.

