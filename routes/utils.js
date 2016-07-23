module.exports.exists = function (value) {
    if (value === undefined)
        return false;
    if (value === null)
        return false;
    return true;
};

module.exports.splitAndTrimTagString = function(tagString) {
    var tags = tagString.split(',');

    for (var i=0; i < tags.length; i++) {
        tags[i] = tags[i].trim();

        // Remove empty tags
        if (tags[i].length === 0) {
            tags.splice(i);
            i--;
        }
    }
    return tags;
};

module.exports.yyyymmdd_to_date = function(dateString) {
    var array = dateString.split('/');
    var date = array[2] + '-' + array[1] + '-' + array[0];

    return new Date(date);
};