<template>
  <div class="HomePage container mt-3 mb-3"  dir = "rtl" align = "right">
    <div v-if="fileUploaded">
      <AnnotationsPage v-bind:json="json"/>
    </div>
    <div v-else>
      <h1>כתיבת שאלות על פסקאות מוויקיפדיה</h1>
      <hr>
  <p>
  במשימה זו תקבלו פסקאות אקראיות שנלקחו מערכים בוויקיפדיה. לכל פסקה תתבקשו לנסח שני סוגים של שאלות הבנת הנקרא:
  <br>
  <li>
  3-5 שאלות שיש להן תשובה בפסקה.
  </li>
  <li>1-2 שאלות <b>רלוונטיות</b> לפסקה, אך שאין להן תשובה בפסקה.</li>
  את <b><u>השאלות</u></b> נסחו <b>במילים שלכם</b> ו<b>בשפה חופשית</b> ככל האפשר.
  <br>
  <b><u>התשובה</u></b> היא <b>מילה או מחרוזת מילים מתוך הפסקה</b>, ואותה תסמנו על גבי הפסקה באמצעות העכבר.
  <br>
  <br>
  <h5 align = "right">
  טרם תחילת המשימה יש לקרוא בקפידה את 
  <b><a href="https://docs.google.com/document/d/1mkF5Q_cZcTbVkL91QEpU-QTUEhDmgJTfvkVB-6FQdKg/edit"
   > ההנחיות</a></b>.
    </h5> 
    מומלץ להשאיר את עמוד ההנחיות פתוח בחלון או בטאב נפרד בעת ביצוע המשימה.
    <br>
      <!-- <json-viewer :value="jsonData" :expand-depth="10" copyable></json-viewer> -->
      <br>
      <div class="uploadBar" align = "left">
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="Upload a JSON file here"
          accept=".json"
        ></b-form-file>
      </div>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="readFile(file.name)">Upload</b-button>
    </div>
  </div>
</template>

<script>
import AnnotationsPage from "./AnnotationsPage.vue";

export default {
  name: "HomePage",
  data: function() {
    return {
      jsonData: {
        data: [
          {
            title: "Question answering",
            paragraphs: [
              {
                context:
                  "Question answering (QA) is a computer science discipline within the fields of information retrieval and natural language processing (NLP), which is concerned with building systems that automatically answer questions posed by humans in a natural language.",
                qas: []
              },
              {
                context:
                  "A QA implementation, usually a computer program, may construct its answers by querying a structured database of knowledge or information, usually a knowledge base. More commonly, QA systems can pull answers from an unstructured collection of natural language documents.",
                qas: []
              }
            ]
          },
          {
            title: "Natural language processing",
            paragraphs: "[...]"
          }
        ]
      },
      fileUploaded: false,
      file: null,
      json: null,
      
    };
  },
  methods: {
    readFile: function() {
      // this.fileName = nametogo;

      var reader = new FileReader();
        // eslint-disable-next-line no-console
        // console.log(this);
      reader.onload = function(event) {
        this.json = JSON.parse(event.target.result);
        this.fileUploaded = true;
        
      }.bind(this);
      reader.readAsText(this.file);
      
    }
  },
  components: {
    AnnotationsPage
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uploadBar {
  max-width: 300px;
}
</style>
