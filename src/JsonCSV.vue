<template>
  <div :id="idName" @click="generate">
    <slot>Download {{name}}</slot>
  </div>
</template>

<script>
import mapKeys from "lodash.mapkeys";
import pickBy from "lodash.pickby";
import pick from "lodash.pick";

import { saveAs } from "file-saver";
import { unparse } from "papaparse";

export const isType = (value, type) => typeof value === type;

export default {
  name: "JsonCSV",
  props: {
    /**
     * Json to download
     */
    data: {
      type: Array,
      required: true
    },
    /**
     * fields inside the Json Object that you want to export
     * if no given, all the properties in the Json are exported
     * Can either be an array or a function
     */
    fields: {
      required: false
    },
    /**
     * filename to export, default: data.csv
     */
    name: {
      type: String,
      default: "data.csv"
    },
    /**
     * Delimiter for the CSV file
     */
    delimiter: {
      type: String,
      default: ",",
      required: false
    },
    /**
     * Should the module add SEP={delimiter}
     *
     * Useful for opening file with Excel
     */
    separatorExcel: {
      type: Boolean,
      default: false
    },
    /**
     * What will be the encoding of the file
     */
    encoding: {
      type: String,
      default: "utf-8"
    },
    /**
     * Advanced options for Papaparse that is used to export to CSV
     */
    advancedOptions: {
      type: Object,
      default: () => {}
    },
    /**
     * Labels for columns
     *
     * Object or function
     */
    labels: {
      required: false
    },
    /**
     * Used only for testing purposes
     */
    testing: {
      required: false,
      default: false
    }
  },
  computed: {
    // unique identifier
    idName() {
      const now = new Date().getTime();
      return "export_" + now;
    },
    exportableData() {
      const filteredData = this.cleaningData();
      if (!filteredData.length) {
        return null;
      }

      return filteredData;
    }
  },
  methods: {
    labelsFunctionGenerator() {
      if (
        !isType(this.labels, "undefined") &&
        !isType(this.labels, "function") &&
        !isType(this.labels, "object")
      ) {
        throw new Error("Labels needs to be a function(value,key) or object.");
      }

      if (isType(this.labels, "function")) {
        return item => {
          let _mapKeys = mapKeys(item, this.labels);
          return _mapKeys;
        };
      }

      if (isType(this.labels, "object")) {
        return item => {
          return mapKeys(item, (item, key) => {
            return this.labels[key] || key;
          });
        };
      }

      return item => item;
    },

    fieldsFunctionGenerator() {
      if (
        !isType(this.fields, "undefined") &&
        !isType(this.fields, "function") &&
        !isType(this.fields, "object") &&
        !Array.isArray(this.fields)
      ) {
        throw new Error("Fields needs to be a function(value,key) or array.");
      }

      if (
        isType(this.fields, "function") ||
        (isType(this.fields, "object") && !Array.isArray(this.fields))
      ) {
        return item => {
          return pickBy(item, this.fields);
        };
      }

      if (Array.isArray(this.fields)) {
        return item => {
          return pick(item, this.fields);
        };
      }
      return item => item;
    },

    cleaningData() {
      if (
        isType(this.fields, "undefined") &&
        isType(this.labels, "undefined")
      ) {
        return this.data;
      }

      const labels = this.labelsFunctionGenerator();
      const fields = this.fieldsFunctionGenerator();

      return this.data.map(item => labels(fields(item)));
    },

    generate() {
      this.$emit("export-started");
      const dataExport = this.exportableData;

      if (!dataExport) {
        console.error("No data to export");
        return;
      }

      let csv = unparse(
        dataExport,
        Object.assign(
          {
            delimiter: this.delimiter,
            encoding: this.encoding
          },
          this.advancedOptions
        )
      );
      if (this.separatorExcel) {
        csv = "SEP=" + this.delimiter + "\r\n" + csv;
      }
      //Add BOM when UTF-8
      if (this.encoding === "utf-8") {
        csv = "\ufeff" + csv;
      }
      this.$emit("export-finished");
      if (!this.testing) {
        let blob = new Blob([csv], {
          type: "application/csvcharset=" + this.encoding
        });
        saveAs(blob, this.name);
      }
    }
  }
};
</script>

<style scoped>
div {
  display: inline;
}
</style>
