/**
 * @class Spread.util.TSVTransformer
 * @private
 * Internal class for transforming data pasted from native spreadsheet applications to TSV and back.
 */
Ext.define('Spread.util.TSVTransformer', {

    singleton: true,

    /**
     * @property {String} lineSeparator
     * Line separator char sequence
     */
    lineSeparator: '\n',

    /**
     * @property {String} columnSeparator
     * Column separator char sequence
     */
    columnSeparator: '\t',

    /**
     * Transforms plain array data into TSV plaintext
     * @param {Array} selectionPositions Array of selected position instances
     * @return {String}
     */
    transformToTSV: function(selectionPositions) {

        var currentRow = -1,
            tsvText = '';

        //console.log('transformToTSV', selectionPositions);

        // Loop to already well-ordered array
        for (var i=0; i<selectionPositions.length; i++) {

            // Update record first
            selectionPositions[i].validate();

            // Add line break
            if (currentRow !== selectionPositions[i].row &&
                currentRow !== -1) {

                if (tsvText[tsvText.length-1] == this.columnSeparator) {
                    tsvText = tsvText.substring(0, tsvText.length - 1); // Remove trailing tabulator
                }
                tsvText = this.addLineBreak(tsvText);
            }
            currentRow = selectionPositions[i].row;

            // Add cell value
            tsvText = this.addValue(tsvText, selectionPositions[i]);

            // Add tabulator
            if (selectionPositions[i+1] &&
                selectionPositions[i+1].column !== selectionPositions[+1].view.getSelectionModel().rootPosition.column) {
                tsvText = this.addTabulator(tsvText);
            }
        }

        // Standard-conformity by adding one ending line feed
        tsvText = this.addLineBreak(tsvText);

        return tsvText;
    },

    /**
     * Transforms pasted TSV data into plain array data
     * @param {String} clipboardData Pasted TSV or Excel plain clipboard data
     * @return {Array}
     */
    transformToArray: function(clipboardData) {

        var dataArray = [],
            rows = clipboardData.split(this.lineSeparator);

        for (var i=0; i<(rows.length-1); i++) {
            dataArray.push(
                rows[i].split(this.columnSeparator)
            );
        }
        return dataArray;
    },

    /**
     * Adds line break chars to buffer
     * @param {String} tsvText Current buffer
     * @return {String}
     */
    addLineBreak: function(tsvText) {
        return tsvText + this.lineSeparator;
    },

    /**
     * Adds a tabulator char to buffer
     * @param {String} tsvText Current buffer
     * @return {String}
     */
    addTabulator: function(tsvText) {
        return tsvText + this.columnSeparator;
    },

    /**
     * Adds the value to the buffer
     * @param {String} tsvText Current buffer
     * @param {Spread.selection.Position} position Position reference
     * @return {String}
     */
    addValue: function(tsvText, position) {
        return tsvText += position.getValue();
    }
});