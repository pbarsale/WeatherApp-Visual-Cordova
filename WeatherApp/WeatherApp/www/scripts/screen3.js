var app = new Vue({
    el: '#weathertable',
    data: {
        inzip: '',
        incity: '',
       
        showmodal: false,
        items: [       
        ],

        modalData: {
            zipcode: '', city: '', des: '',
            tempf: '', tempc: '',
            humidity: '', windspeed: '', visibility: '', time :''
        }
    },

    methods: {
        manageModal: function (item) {

            app.showmodal = true;
            app.modalData.zipcode = item.zipcode;
            app.modalData.city = item.city;
            app.modalData.des = item.des;
            app.modalData.tempf = item.tempf;
            app.modalData.tempc = item.tempc;
            app.modalData.humidity = item.humidity;
            app.modalData.windspeed = item.windspeed;
            app.modalData.visibility = item.visibility;
            app.modalData.time = item.time;
        }
    },
    computed: {

        filteredItems: function () {            
            var self = this;
           
            return self.items.filter(function (item) {

                if (item.show == true)
                    return true;

                else
                {
                    if (self.inzip == "" && self.incity != "") {
                        return (item.city.toLowerCase().indexOf(self.incity.toLowerCase()) != -1);
                    }
                    else if (self.inzip != "" && self.incity == "") {
                        return (item.zipcode.toLowerCase().indexOf(self.inzip.toLowerCase()) != -1);
                    }
                    else if (self.inzip != "" && self.incity != "") {
                        return ((item.zipcode.toLowerCase().indexOf(self.inzip.toLowerCase()) != -1) && (item.city.toLowerCase().indexOf(self.incity.toLowerCase()) != -1));
                    }
                    else
                        return true;
                }             
            })
        }       
    },          

    beforeCreate: function ()
    {       
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/csv");
        xobj.open('GET', '../../finaldata.csv', true); // Replace 'my_data' with the path to your file

        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {

               var data = xobj.responseText.split("\n");

                              
                for (i = 1; i < data.length - 2; i++)
                {
                    var row = data[i].split(",");  
                    row[1] = row[1].substr(1, row[1].length);
                    row[2] = row[2].substr(0, row[2].length - 1);
                    row[11] = row[11].substr(1, row[11].length);
                    row[12] = row[12].substr(0, row[12].length - 2);

                    app.items.push({zipcode: row[0], city: row[1] + "," + row[2], des: row[5], tempf: row[6], tempc: row[7], humidity: row[8], windspeed: row[9], visibility: row[10], time : row[11] + "," + row[12], show: false});                    
                }

            }
        };
        xobj.send(null);  
    }
});

function makeTableScroll() {

   
    var maxRows = 10;

    var table = document.getElementById('table');
    var wrapper = table.parentNode;
    var rowsInTable = table.rows.length;
    var height = 0;
    if (rowsInTable > maxRows) {
        for (var i = 0; i < maxRows; i++) {
            height += table.rows[i].clientHeight;
        }
        wrapper.style.height = height + "px";
    }
}
