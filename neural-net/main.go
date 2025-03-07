package main

import (
	"fmt"

	"github.com/theashishmaurya/byonn/reader"
	"github.com/theashishmaurya/byonn/utils"
)

func main() {
	training_images, training_labels, test_images, test_labels, err := reader.ReadData()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Visualize first 20 digits

	utils.PrintDigits(training_images, 1)
	utils.PrintDigits(test_images, 1)
	fmt.Println(training_labels[0])
	fmt.Println(test_labels[0])
}
