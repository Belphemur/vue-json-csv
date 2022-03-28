<template>
  <div :id="idName" @click="generate">
    <slot>Download {{ name }}</slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import mapKeys from "lodash.mapkeys";
import pickBy from "lodash.pickby";
import pick from "lodash.pick";

import {saveAs} from "file-saver";
import {unparse} from "papaparse";

export const isType = (value: any, type: string) => typeof value === type;

export default defineComponent({
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
      type: [Array, Function],
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
      default: () => {
      }
    },
    /**
     * Labels for columns
     *
     * Object or function
     */
    labels: {
      type: [Object, Function],
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

    labelsFunctionGenerator(): (item: any) => any {
      let labels: any = this.labels;
      if (
          !isType(labels, "undefined") &&
          !isType(labels, "function") &&
          !isType(labels, "object")
      ) {
        throw new Error("Labels needs to be a function(value,key) or object.");
      }

      if (isType(labels, "function")) {
        return (item: any) => {
          let _mapKeys = mapKeys(item, labels);
          return _mapKeys;
        };
      }

      if (isType(labels, "object")) {
        return item => {
          return mapKeys(item, (item, key) => {
            return labels[key] || key;
          });
        };
      }

      return item => item;
    },

    fieldsFunctionGenerator(): (item: any) => any {
      let fields: any = this.fields;
      if (
          !isType(fields, "undefined") &&
          !isType(fields, "function") &&
          !isType(fields, "object") &&
          !Array.isArray(fields)
      ) {
        throw new Error("Fields needs to be a function(value,key) or array.");
      }

      if (
          isType(fields, "function") ||
          (isType(fields, "object") && !Array.isArray(fields))
      ) {
        return item => {
          return pickBy(item, fields);
        };
      }

      if (Array.isArray(fields)) {
        return item => {
          return pick(item, fields);
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
          type: "text/csv;charset=" + this.encoding
        });
        saveAs(blob, this.name);
      }
    }
  }
});
</script>

<style scoped>
div {
  display: inline;
}
</style>
