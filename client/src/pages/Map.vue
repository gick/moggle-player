<template>
  <v-ons-page>
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions" style="height: 60vh">
      <l-marker :lat-lng.sync="position"></l-marker>
      <l-circle
        :lat-lng="{lat:poi.latitude,lng:poi.longitude}"
        :radius="poi.map.areaRadius"
        :color="'yellow'"
      />

      <l-tile-layer :url="url" :options="mapOptions" :attribution="attribution"/>
    </l-map>
    <p v-show="completed" style="text-align:center;">
      <v-ons-button @click="next">Suivant</v-ons-button>
    </p>
    <p style="text-align:center;">
      <v-ons-button @click="complete">Compléter l'activité</v-ons-button>
    </p>

  </v-ons-page>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LCircle,
  LMarker,
  LPopup,
  Vue2Leaflet,
  LTooltip
} from "vue2-leaflet";

export default {
  data() {
    return {
      completed:false,
      map: null,
      zoom: 19,
      center: L.latLng(48.08497, -0.75763),
      url: "//proxy-ign.openstreetmap.fr/94GjiyqD/bdortho/{z}/{x}/{y}.jpg",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      position: [47.41322, -1.219482],
      mapOptions: {
        zoomSnap: 0.5,
        maxZoom: 19
      }
    };
  },
  props:["poi","inventoryItem"],
  components: {
    LCircle,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },

  computed: {},
  created() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject; // work as expected
      this.map.locate({ setView: true, maxZoom: 19, zoom: 19 });
    });
  },
  mounted() {
    let options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    };
    navigator.geolocation.watchPosition(
      this.locationfound,
      this.locationerror,
      options
    );
  },
  methods: {
    distance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var radlon1 = (Math.PI * lon1) / 180;
      var radlon2 = (Math.PI * lon2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "M") {
        dist = dist * 1.609344*1000;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    },
    next() {
      this.$store.dispatch("activities/nextPage");
    },
    locationfound(e) {
      this.position = [e.coords.latitude, e.coords.longitude];
      let dist=this.distance(this.position[0],this.position[1],this.poi.latitude,this.poi.longitude,'M')
      if(dist<=this.poi.map.areaRadius){
        this.complete()
      }
    }
    ,
    complete(){
      this.completed=true
      this.$toasted.show('Bravo, vous avez atteint la destination',{ duration: 2000,position:'top-center',theme:'bubble' } )
      if(this.inventoryItem){
      this.$toasted.show('Vous avez gagné un item d\'inventaire',{ duration: 3000,position:'bottom-center' } )
      this.$store.commit('users/setInventoryItem',this.inventoryItem)
      }
   }
  }
};
</script>

<style>
.intro {
  text-align: left;
  padding: 0 22px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";
</style>
