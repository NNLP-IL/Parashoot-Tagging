<template>
  <div class="AnnotationsPage container mt-3">
    <div>
      <b-navbar sticky toggleable="lg" class="pl-0">
        <b-navbar-brand>cdQA-annotator - Welcome User Number {{this.json.prolificID}}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item>
              <svg-progress-bar :value="data_number / json.data.length * 100" :options="options"></svg-progress-bar>
            </b-nav-item>
            <b-nav-form>
              <!-- <vue-bootstrap-typeahead
                size="sm"
                v-model="query"
                :data="autocomplete"
                placeholder="Search a document..."
                @hit="data_number = autocomplete.indexOf($event) + 1; context_number = 1"
              /> -->
            </b-nav-form>
              <!-- <p>Message is: {{ message }}</p> -->
            <b-nav-item right>
              <b-button
                :size="'sm'"
                :variant="'primary'"
                v-on:click="delete_empty_document()"
                v-download-data="valid_json"
                v-download-data:type="'json'"
                v-download-data:filename="getName()"
              >Download</b-button>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>       
    <br>
    <div v-if="this.toEnd == false">
      <!-- <h2>{{ json.data[data_number - 1].title }}</h2> -->
      <!-- <span
        class="text-muted" dir="rtl" 
      >פסקה {{ context_number }} מתוך {{ json.data[data_number - 1].paragraphs.length }} | מסמך {{ data_number }} מתוך {{ json.data.length }}</span> -->
      <br>
      <div class="demo">
      <br>
      <p ref="paragraph" v-selection.fix="{getSelection:getSelection}" dir="rtl">{{ paragraph_context }}</p>
      <div><b>בחרו סוג שאלה שברצונכם להוסיף:</b></div>
        <input type="radio" id="one" value=true v-model="withAnswer" />
        <label for="one">שאלה ש<b>יש</b> לה מענה בפסקה</label>
        <br>
        <input type="radio" id="two" value=false v-model="withAnswer"/>
        <label for="two">שאלה ש<b>אין</b> לה מענה בפסקה</label>
        <br>
        <br>
      </div>
      <br>
      <b-form-input v-model="question" type="text" placeholder="הקלידו שאלה לגבי הטקסט..." dir="rtl"></b-form-input>
      <br>

      <b-form-input v-model="answer" type="text" placeholder="סמנו תשובה מתוך הפסקה - היא תופיע פה" dir="rtl"></b-form-input>
      <br>
      <b-button :size="''" :variant="'secondary'" v-on:click="addAnnotation()">הוספת שאלה ותשובה</b-button> 
      <br>
      <br>
      <p style="color:red;">{{ errors }}</p>
      <br>
      <br>

      <b-table striped hover :items="items" :fields="fields">
        <template slot="עריכה" slot-scope="row">
          <b-button :size="''" :variant="'danger'" @click.stop="deleteAnnotation(row.index)">Delete</b-button>
        </template>
      </b-table>
      <br>

      <div v-if="data_number > 1 && context_number == 1">
        <b-button
          :size="''"
          :variant="'outline-secondary'"
          v-on:click="saveJSON('end')"
        >סיימתי</b-button>
         או 
        <b-button :size="''" :variant="'outline-primary'" v-on:click="getAnotherFile()">לפסקה הבאה</b-button>
      </div>
      <div v-else-if="context_number < json.data[data_number - 1].paragraphs.length">
        <b-button
          :size="''"
          :variant="'outline-secondary'"
          v-on:click="saveJSON('end')"
        >סיימתי</b-button>
         או 
        <b-button :size="''" :variant="'outline-primary'" v-on:click="getAnotherFile()">לפסקה הבאה</b-button>
      </div>
      <div v-else>
        <b-button
          :size="''"
          :variant="'outline-secondary'"
          v-on:click="saveJSON('end')"
        >סיימתי</b-button> 
        או 
        <b-button
          :size="''"
          :variant="'outline-primary'"
          v-on:click="getAnotherFile()"
        >לפסקה הבאה</b-button>
      </div>
      <br>
      <br>
    </div>
    <div v-else>
  <h3>תודה רבה על ההשתתפות!
    <img
          src="../assets/ablobmaracas.gif"
          height="30"
          width="30"
      >
  </h3>
<h5>זהו קוד סיום המשימה: {קוד יופיע פה}</h5>
<h5>העתיקו אותו כדי לדווח ב-Prolific שסיימתם את המשימה</h5>
     <br>
      <b-button
          :size="''"
          :variant="'primary'"
          href="prolific.co"
      >To Prolific
      </b-button>
      <br>
      <br>
      <!-- <b-button
          :size="''"
          :variant="'primary'"
          v-on:click="getRandomFile()"
      >תנו לי עוד אחד
      </b-button> -->
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
const config ={
        apiKey: "AIzaSyB70IFdsSJ056tK0OWqEJMEnzhRQuAHuPI",
        authDomain: "parashot-88db8.firebaseapp.com",
        projectId: "parashot-88db8",
        storageBucket: "parashot-88db8.appspot.com",
        messagingSenderId: "754346365422",
        appId: "1:754346365422:web:3a3c5096fed773e4237eff",
        measurementId: "G-8Q98XS0NPJ"
}
const firebaseApp = firebase.initializeApp(config)

const db = firebaseApp.firestore()
const userCollection = db.collection('users')

export const addAnnotationToDB = tag => {
    return userCollection.add(tag)
}
const uuidv4 = require('uuid/v4');

export default {
  name: "AnnotationsPage",
  props: ["json" ],
  data: function() {
    return {
      data_number: 1,
      context_number: 1,
      question: "",
      answer: "",
      fields: ["שאלות", "תשובות", "עריכה" , "יש תשובה בטקסט"],
      query: "",
      message: "",
      errors: "",
      textSelected: false,
      toEnd: false,
      withAnswer:true
    };
  },
  methods: {
    addAnnotation: function() {
      if(this.checkAnswers() == false) return
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      var qa = {
        question: this.question,
        id: uuidv4(),
        answers: [{ answer_start: this.answer_start, text: this.answer ,withAnswer:this.withAnswer }]
      };
      paragraph_container.qas.push(qa);
      this.question = "";
      this.answer = "";
      this.textSelected = false;
    },
    deleteAnnotation: function(row_index) {
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      paragraph_container.qas.splice(row_index, 1);
    },
    getSelection: function(fixStr) {
      this.answer = fixStr;
      this.textSelected = true;
    },
    delete_paragraph: function() {
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs;
      paragraph_container.splice([this.context_number - 1], 1);
    },
    delete_empty_document: function() {
      for (var i in this.json.data) {
        if (this.json.data[i].paragraphs.length == 0) {
          this.json.data.splice(i, 1);
        }
      }
    },
    checkAnswers: function(){
      // eslint-disable-next-line no-console
      // console.log(this)
      if(this.question == "" || this.answer ==""){
        this.errors = "נא להכניס שאלה על הפסקה ותשובה לשאלה זו מתוך הפסקה";
        return false;
      }
      else{
          this.errors = "";
          return true;
      }
    },
    saveJSON: async function (type) {
      if(type == "end")
        this.toEnd = true;
      if(this.json.data[this.data_number - 1].paragraphs[this.context_number - 1].qas.length == 0) return;//if page is empty do not save
      var json1 = JSON.stringify(this.json).replace(/[\u007F-\uFFFF]/g, function(
        chr
      ) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
      });
      let tosend = {
        'json_data': json1,
        'prolificID': this.json.prolificID,
        'filename': "heb_squad-v1.1_" + this.pad(this.json.jsonID, 3) + "_" + "Tagged" + ".json"
      }
      await addAnnotationToDB(tosend);
    },
    getAnotherFile: async function () {
      let pro = this.json.prolificID;
      this.saveJSON("continue");
      this.jsonID = this.getRandomInt(21, 399).toString();
      this.json = require("../../src/json_resources/heb_squad-v1.1_" + this.pad(this.jsonID, 3) + ".json");
      this.json.jsonID = this.jsonID;
      this.json.prolificID = pro;
      this.data_number = 1;
    },
    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pad: function (num, size) {
      while (num.length < size) num = "0" + num;
      return num;
    },
    getName: function(){
      // eslint-disable-next-line no-console
      // console.log(this);
      // this.filename 
      // return this.json.data[0].title + " tagged";
      let tmpJsonID = this.json.jsonID;
      // delete this.json.jsonID;
      return "annotated_data_" + tmpJsonID + ".json";
    }
  },
  computed: {
    valid_json: function() {
      var json = JSON.stringify(this.json).replace(/[\u007F-\uFFFF]/g, function(
        chr
      ) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
      });
      return json;
    },
    autocomplete: function() {
      var idx = [];
      for (var i = 0; i < this.json.data.length; i++) {
        idx.push(this.json.data[i].title);
      }
      return idx;
    },
    items: function() {
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      var items = [];
      for (var i = 0; i < paragraph_container.qas.length; i++) {
        var item = {
          // fields: ["שאלות", "תשובות", "עריכה" , "יש-תשובה"]
          שאלות: paragraph_container.qas[i].question,
          תשובות: paragraph_container.qas[i].answers[0].text,
          'יש תשובה בטקסט': paragraph_container.qas[i].answers[0].withAnswer
        };
        items.push(item);
      }
      return items;
    },
    paragraph_context: function() {
      return this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ].context;
    },
    answer_start: function() {
      return this.paragraph_context.indexOf(this.answer);
    },
    options() {
      return {
        radius: 15,
        circleLineCap: "round",
        varyStrokeArray: [1, 2],
        pathColors: ["lightgrey", "rgb(40, 167, 69)"],
        text: function(value) {
          return (
            this.htmlifyNumber(value) + '<span style="font-size: 1em;">%</span>'
          );
        },
        textColor: "black"
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>


