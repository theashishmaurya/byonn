package utils

import (
	"fmt"
	"strings"
)

// PrintDigits visualizes multiple MNIST digits from the provided image data
func PrintDigits(images [][]float64, count int) {
	// Ensure we don't try to print more digits than we have
	if count > len(images) {
		count = len(images)
	}

	for digit := 0; digit < count; digit++ {
		fmt.Printf("\nDigit #%d:\n", digit+1)
		// Print horizontal separator
		fmt.Println(strings.Repeat("-", 56))

		// Print the digit visualization
		for i := 0; i < 28; i++ {
			for j := 0; j < 28; j++ {
				pixel := images[digit][i*28+j]
				if pixel > 0.7 {
					fmt.Print("██")
				} else if pixel > 0.4 {
					fmt.Print("▓▓")
				} else if pixel > 0.1 {
					fmt.Print("░░")
				} else {
					fmt.Print("  ")
				}
			}
			fmt.Println()
		}
		fmt.Println(strings.Repeat("-", 56))
	}
}
