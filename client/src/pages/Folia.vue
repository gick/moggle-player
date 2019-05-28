<template>
  <v-ons-page>
    <div class="background"></div>
    <div class="content" style>
      <v-ons-card>
        <div class="title">{{ data.question }}</div>
        <div class="content">
          <p>
            Prenez une photo de feuille puis réaliser un tracé à l'intérieur de
            la feuille
          </p>
          <FileUpload :disabled="foliaStarted" @image="setImage"></FileUpload>
        </div>
      </v-ons-card>
      <v-ons-card v-if="foliaStarted">
        <div class="title">Identification en cours</div>
        <div class="content">
          <div style="position:relative;">
            <p>
              <v-ons-progress-bar :value="currentStep"></v-ons-progress-bar>
            </p>
          </div>
        </div>
      </v-ons-card>
      <div v-if="foliaResult.length">
        <v-ons-card v-if="correct">
          <div class="title">Bravo! Vous avez identifié correctement</div>
          <div class="content">
            <p>{{ data.correctMessage }}</p>
          </div>
        </v-ons-card>
        <v-ons-card v-else>
          <div class="title">Raté, vous pouvez réessayer ou passer l'activité</div>
          <div class="content">
            <p>{{ data.wrongMessage }}</p>
          </div>
        </v-ons-card>

        <v-ons-list>
          <v-ons-list-header class="myHeader" @click="showResult=!showResult">Résultats détaillés    ⇕</v-ons-list-header>
          <b-collapse :open='showResult'>
          <v-ons-list-item
            :class="specieResult.correct ? 'correct' : ''"
            v-for="(specieResult, index) in foliaResult"
            :key="index"
          >
            <div class="center">{{ specieResult.species }} {{ specieResult.percent }}%</div>
          </v-ons-list-item>
          </b-collapse>
        </v-ons-list>
      </div>
      <p v-show="foliaResult.length>0 || error" style="text-align:center;margin-top:20px; ">
        <v-ons-button @click="next">Suivant</v-ons-button>
      </p>
    </div>
    <v-ons-modal :visible="modalVisible">
      <div style="position:relative;">
        <img
          ref="image"
          :src="imageData"
          @load="imageLoaded"
          style="height: 400px;"
        >
        <VueSignaturePad
          :options="{
						dotSize: 5,
						minWidth: 15,
						maxWidth: 15,
						penColor: 'rgb(0,125,0)',
						onBegin
					}"
          :width="width"
          :height="height"
          ref="signaturePad"
          style="position:absolute;top:0;left: 0;right: 0;margin: auto;"
        ></VueSignaturePad>
      </div>
      <p>Réalisez un tracé à l'intérieur de la feuille puis valider</p>
      <v-ons-button
        style="position: absolute;left: 0;right: 0;bottom: 1px"
        @click="sendImages"
      >Valider</v-ons-button>
    </v-ons-modal>
  </v-ons-page>
</template>
<style>
.correct {
	background-color: lightgreen;
}
.myHeader{
  line-height:43px;
  font-size: 19px;
  background-color: lightsteelblue;
}
</style>

<script>
import { SSE } from '../js/sse.js'
import VueSignaturePad from 'vue-signature-pad'
import FileUpload from '../components/FileUpload.vue'
import { Promise } from 'q'
export default {
	data() {
		return {
			imageData: '',
			width: '0',
			height: '0',
      currentStep: 0,
      showResult:false,
			foliaStarted: false,
			foliaResult: [],
			draw: false,
			correct: false,
			modalVisible: false,
			error: false
		}
	},
	components: {
		VueSignaturePad,
		FileUpload
	},
	props: ['data'],
	methods: {
		onBegin() {
			this.draw = true
		},
		next() {
			this.$store.dispatch('activities/nextPage')
		},
		restart() {
			this.imageData = ''
			this.$refs.signaturePad.clearSignature()
			this.width = '0'
			this.height = '0'
			this.foliaStarted = false
			this.foliaResult = []
			this.currentStep = 0
			this.draw = false
		},
		imageLoaded() {
			this.modalVisible = true
			this.$refs.signaturePad.resizeCanvas()
			this.$nextTick(() => {
				this.width = this.$refs.image.clientWidth + 'px'
				this.height = this.$refs.image.clientHeight + 'px'
				this.$nextTick(() => {
					this.$refs.signaturePad.resizeCanvas()
				})
			})
		},
		resizedataURL(datas, wantedWidth, wantedHeight, type) {
			return new Promise(function(resolve, reject) {
				// We create an image to receive the Data URI
				var img = document.createElement('img')

				// When the event "onload" is triggered we can resize the image.
				img.onload = function() {
					// We create a canvas and get its context.
					var canvas = document.createElement('canvas')
					var ctx = canvas.getContext('2d')

					// We set the dimensions at the wanted size.
					canvas.width = wantedWidth
					canvas.height = wantedHeight

					// We resize the image with the canvas method drawImage();
					ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight)

					var dataURI = canvas.toDataURL(type)
					resolve(dataURI)
				}
				img.src = datas
			})
		},
		parseResult(res) {
			this.foliaStarted = false
			for (let item of res) {
				let species = _.startCase(item.split(',')[0])
				let percent = parseInt(item.split(',')[1])
				let correct = false
				for (let target of this.data.targetSpecies) {
					if (target.label == species) {
						correct = true
						this.correct = true
					}
				}
				this.foliaResult.push({
					species: species,
					percent: percent,
					correct: correct
				})
			}
		},
		handleError() {
			this.$toasted.show(
				'Erreur lors de la reconnaissance. Essayez avec une autre photo.',
				{
					fullWidth: true,
					position: 'bottom-center',
					duration: 4000,
					singleton: true
				}
			)
			this.error = true
			this.restart()
		},

		sendImages() {
			this.modalVisible = false
			let { status, data } = this.$refs.signaturePad.saveSignature()
			this.foliaStarted = true
			this.resizedataURL(
				data,
				Number(this.width.replace('px', '')),
				Number(this.height.replace('px', '')),
				'image/png'
			).then(dataURI => {
				this.resizedataURL(
					this.imageData,
					Number(this.width.replace('px', '')),
					Number(this.height.replace('px', '')),
					'image/jpeg'
				).then(imageData => {
					let data = new FormData()
					data.append('trace', dataURI)
					data.append('leaf', imageData)

					var source = new SSE('/api/setupImages', {
						headers: { 'Content-Type': 'application/json;charset=UTF-8' },
						payload: JSON.stringify({ trace: dataURI, leaf: imageData })
					})
					source.addEventListener(
						'error',
						function(e) {
							if (this.foliaStarted) {
								this.handleError()
								source.close()
							}
						}.bind(this)
					)

					source.addEventListener(
						'message',
						function(e) {
							// Assuming we receive JSON-encoded data payloads:
							var payload = JSON.parse(e.data)
							console.log(payload)
							this.currentStep = this.currentStep + 3
							if (payload.error) {
								this.handleError()
								source.close()
							}
							if (payload.data) {
								this.foliaStarted = false
								this.parseResult(payload.data)
								source.close()
							}
						}.bind(this)
					)
					source.stream()
				})
			})
		},
		setImage(imageData) {
      this.restart()
			this.imageData = imageData
		}
	}
}
</script>
