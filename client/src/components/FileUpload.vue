<template>
	<div style="display:inline-block;" class="file-upload-form">
		<v-ons-button :disabled="disabled" @click="$refs.pictureInput.click()"
			>Photo</v-ons-button
		>
		<input
			type="file"
			@change="rotateImage"
			ref="pictureInput"
			style="display:none"
			accept="image/*;capture=camera"
		/>
	</div>
</template>
<script>
import imageCompression from 'browser-image-compression'
import { functions } from 'firebase';
const imageFileToBase64 = require('image-file-to-base64-exif')

export default {
	data() {
		return { imageData: '' } // we will store base64 format of image in this string
	},
	props: ['disabled'],
	methods: {
		rotateImage: function(event) {
			var imageFile = event.target.files[0]
      imageFileToBase64(imageFile,600,600,0.8)
        .then(function(base64){
          this.$emit('image',base64)
        }.bind(this))
			
		},
		previewImage: function(event) {
			// Reference to the DOM input element
			var imageFile = this.$refs.pictureInput.files[0]
			console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
			console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)
			var options = {
				maxSizeMB: 0.1,
				maxWidthOrHeight: 600
			}

			var maxSizeMB = 0.5
			var maxWidthOrHeight = 600 // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight
			imageCompression(imageFile, options) // maxSizeMB, maxWidthOrHeight are optional
				.then(
					function(compressedFile) {
						console.log(
							'compressedFile instanceof Blob',
							compressedFile instanceof Blob
						) // true
						console.log(
							`compressedFile size ${compressedFile.size / 1024 / 1024} MB`
						) // smaller than maxSizeMB
						imageCompression.getDataUrlFromFile(compressedFile).then(
							function(compressedDataURI) {
								this.$emit('image', compressedDataURI)
								this.$refs.pictureInput.value = ''
							}.bind(this)
						)
						//return uploadToServer(compressedFile); // write your own logic
					}.bind(this)
				)
				.catch(function(error) {
					console.log(error.message)
				})
		}
	}
}
</script>
