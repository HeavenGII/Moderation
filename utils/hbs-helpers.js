module.exports = {
    ifeq(a,b,options){
        if (a == b){
            return options.fn(this)
        }
        return options.inverse(this)
    },

    ifauth(a,b,options){
        if (a != b){
            return options.fn(this)
        }
        return options.inverse(this)
    },

    formatDate: function(date) {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
      }
}