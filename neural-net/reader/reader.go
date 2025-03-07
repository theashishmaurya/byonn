package reader

import (
	"encoding/binary"
	"errors"
	"fmt"
	"log"
	"os"
)

const (
	trainingImagesPath = "mnist/train-images.idx3-ubyte"
	trainingLabelsPath = "mnist/train-labels.idx1-ubyte"
	testImagesPath     = "mnist/t10k-images.idx3-ubyte"
	testLabelsPath     = "mnist/t10k-labels.idx1-ubyte"
)

// ReadImages reads both training and test images from MNIST dataset
func ReadImages() (trainingImages [][]float64, testImages [][]float64, err error) {
	trainingImages, err = readMnistImages(trainingImagesPath, 60000)
	if err != nil {
		return nil, nil, err
	}

	testImages, err = readMnistImages(testImagesPath, 10000)
	if err != nil {
		return nil, nil, err
	}

	return trainingImages, testImages, nil
}

// ReadLabels reads both training and test labels from MNIST dataset
func ReadLabels() (trainingLabels [][]float64, testLabels [][]float64, err error) {
	trainingLabels, err = readMnistLabels(trainingLabelsPath, 60000)
	if err != nil {
		return nil, nil, err
	}

	testLabels, err = readMnistLabels(testLabelsPath, 10000)
	if err != nil {
		return nil, nil, err
	}

	return trainingLabels, testLabels, nil
}

// Generic function to read image data from a file
func readMnistImages(filepath string, expectedImages uint32) ([][]float64, error) {
	// Open the file
	file, err := os.Open(filepath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Read the header
	header := make([]byte, 16)
	_, err = file.Read(header)
	if err != nil {
		return nil, err
	}

	// Parse header information
	magicNumber := binary.BigEndian.Uint32(header[0:4])
	numImages := binary.BigEndian.Uint32(header[4:8])
	numRows := binary.BigEndian.Uint32(header[8:12])
	numCols := binary.BigEndian.Uint32(header[12:16])

	fmt.Println("Image file:", filepath)
	fmt.Println("Magic number:", magicNumber, "Images:", numImages, "Rows:", numRows, "Columns:", numCols)

	// Validate header
	if magicNumber != 2051 {
		return nil, errors.New("invalid magic number for image file")
	}

	if numImages != expectedImages {
		return nil, fmt.Errorf("expected %d images, but found %d", expectedImages, numImages)
	}

	// Read image data
	images := make([][]float64, numImages)
	for i := range images {
		/**
		 * MNIST image data format explanation:
		 *
		 * Each image is a 28x28 grayscale image, but stored as a 1D array of 784 bytes.
		 *
		 * Example:
		 * A 2D representation of the image might look like:
		 * [0,255,255,0,0]
		 * [0,255,255,0,0]
		 * [0,255,255,0,0]
		 * [0,255,255,0,0]
		 * [0,255,255,0,0]
		 * ... and so on
		 *
		 * How the image is stored in the file (in a single row):
		 * 0,255,255,0,0, 0,255,255,0,0, 0,255,255,0,0, 0,255,255,0,0, 0,255,255,0,0, ...
		 *
		 * We create a 1D array of size numRows*numCols (784 for MNIST) to hold each image.
		 * Then we normalize each pixel value from 0-255 to 0.0-1.0 for neural network processing.
		 */
		images[i] = make([]float64, numRows*numCols)
		tempImage := make([]byte, numRows*numCols)
		_, err := file.Read(tempImage)
		if err != nil {
			return nil, err
		}

		// Normalize pixel values to [0,1]
		for j := range tempImage {
			images[i][j] = float64(tempImage[j]) / 255.0
		}
	}

	return images, nil
}

// Generic function to read label data from a file
func readMnistLabels(filepath string, expectedLabels uint32) ([][]float64, error) {
	// Open the file
	file, err := os.Open(filepath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Read the header
	header := make([]byte, 8)
	_, err = file.Read(header)
	if err != nil {
		return nil, err
	}

	// Parse header information
	magicNumber := binary.BigEndian.Uint32(header[0:4])
	numLabels := binary.BigEndian.Uint32(header[4:8])

	fmt.Println("Label file:", filepath)
	fmt.Println("Magic number:", magicNumber, "Labels:", numLabels)

	// Validate header
	if magicNumber != 2049 {
		return nil, errors.New("invalid magic number for label file")
	}

	if numLabels != expectedLabels {
		return nil, fmt.Errorf("expected %d labels, but found %d", expectedLabels, numLabels)
	}

	/**
	 * MNIST label format:
	 * - Each label is a single byte representing a digit from 0-9
	 * - We convert each label to a one-hot encoded vector of length 10
	 * - For example, the digit 3 becomes [0,0,0,1,0,0,0,0,0,0]
	 */
	// Read label data
	labels := make([][]float64, numLabels)
	for i := range labels {
		// One-hot encoding for digits 0-9
		labels[i] = make([]float64, 10)
		var label uint8
		err := binary.Read(file, binary.BigEndian, &label)
		if err != nil {
			return nil, err
		}
		labels[i][label] = 1.0
	}

	return labels, nil
}

// ReadData is the original function for backward compatibility
// It reads both images and labels from MNIST dataset
func ReadData() (trainingImages [][]float64, trainingLabels [][]float64,
	testImages [][]float64, testLabels [][]float64, err error) {

	trainingImages, testImages, err = ReadImages()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	trainingLabels, testLabels, err = ReadLabels()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	return trainingImages, trainingLabels, testImages, testLabels, nil
}
