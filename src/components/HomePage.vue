<template>
  <div class="HomePage container mt-3 mb-3">
    <div v-if="fileUploaded">
      <AnnotationsPage v-bind:json="json"/>
    </div>
    <div v-else>
      <h1>cdQA-annotator</h1>
      <hr>
      <p>
        cdQA-annotator a web-based annotator for closed-domain question answering datasets created for the
        <a
            href="https://github.com/cdqa-suite"
        >cdQA-suite</a> project.
      </p>
      <p>
        To get started, upload a
        <a href="https://rajpurkar.github.io/SQuAD-explorer/">SQuAD v1.1</a>-like JSON file
        where each document in the corpus has been pre-cut into paragraphs.
      </p>
      <p>
        <strong>Example:</strong>
      </p>
      <json-viewer :value="jsonData" :expand-depth="10" copyable></json-viewer>
      <br>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="getRandomFile()">Start Annotation</b-button>
      <br>
    </div>
  </div>
</template>

<script>
import AnnotationsPage from "./AnnotationsPage.vue";

export default {
  name: "HomePage",
  data: function () {
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
      jsonID: null,
      json: null
    };
  },
  methods: {
    pad: function (num, size) {
      while (num.length < size) num = "0" + num;
      return num;
    },
    readFile: function (jsonID) {
      this.json = require("../json_resources/heb_squad-v1.1_" + this.pad(jsonID, 4) + ".json");
      this.json.jsonID = jsonID;
      this.fileUploaded = true;
    },
    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomFile: function () {
      this.jsonID = this.getRandomInt(21, 2684).toString();
      this.json = require("../json_resources/heb_squad-v1.1_" + this.pad(this.jsonID, 4) + ".json");
      this.json.jsonID = this.jsonID;
      this.fileUploaded = true;
    },
    state: function (jsonID) {
      var intID = parseInt(jsonID)
      return intID > 0 && intID < 1200;
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
