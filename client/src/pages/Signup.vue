<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>

    <v-ons-list>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="md-face" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-input float style="width:100%"  placeholder="Email" v-model="email"></v-ons-input>
        </label>
      </v-ons-list-item>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="fa-key" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-input
            type="password"
            float
           
            placeholder="Mot de passe"
            v-model="password"
          ></v-ons-input>
        </label>
      </v-ons-list-item>
      <v-ons-list-item :modifier="md ? 'nodivider' : ''">
        <div class="left">
          <v-ons-icon icon="fa-key" class="list-item__icon"></v-ons-icon>
        </div>
        <label class="center">
          <v-ons-input
            type="password"
            float
            placeholder="Confirmer mot de passe"
            v-model="validatePassword"
          ></v-ons-input>
        </label>
      </v-ons-list-item>
    </v-ons-list>
    <p style="text-align: center">
      <v-ons-button
        @click="signup"
      >Créer compte</v-ons-button>
    </p>
  </v-ons-page>
</template>
<script>
import { auth } from "../firebase";
export default {
  data() {
    return {
      email: "",
      password: "",
      validatePassword: ""
    };
  },
  computed: {
      uid(){
          return this.$store.state.users.id
      }
  },
  watch:{
      'uid':function(val){
          if(val.length>0){
              this.$store.commit('navigator/pop')
          }
      }
  },

  methods: {
    signup() {
      if (this.password != this.validatePassword) {
        this.$ons.notification.alert("Les mots de passe ne sont pas identique");
        return;
      }
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            this.$ons.notification.alert("Mot de passe trop faible.");
          }
          if (errorCode == "auth/invalid-email") {
            this.$ons.notification.alert("Email non valide.");
          }
          if (errorCode == "auth/email-already-in-use") {
            this.$ons.notification.alert("Email déjà utilisé.");
          }
        }.bind(this));
    },
    next() {
      this.$store.commit("activities/endGame");
      this.$store.commit("navigator/pop");
    }
  }
};
</script>
