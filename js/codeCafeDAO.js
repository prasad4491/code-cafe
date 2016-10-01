function codeCafeDAO() {
    this.createDB = function() {
        var dbSize = 30 * 1024 * 1024; // 5MB
        this.db = openDatabase("CodeCafe", "1", "Code Cafe db", dbSize);
        this.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                "website(id TEXT PRIMARY KEY ASC, title TEXT, metadata TEXT,source_code TEXT,compiler_status TEXT,compiler_dupstatus TEXT, language TEXT,level TEXT,users_attempted INTEGER)", []);
        });
    };
    this.insertWebsites = function(websites) {
        if (websites) {
            var totalWebsites = websites.length;
            for (var i = 0; i < totalWebsites; i++) {
                this.insertWebsite(websites[i]);
            }
        }
    };
    this.insertWebsite = function(website) {
        if (website.compiler_status.indexOf("Accepted") > -1) {
            website.compiler_dupstatus = "Accepted";
        } else if (website.compiler_status.indexOf("Skipped") > -1) {
            website.compiler_dupstatus = "Skipped";
        } else
        if (website.compiler_status.indexOf("Memory") > -1) {
            website.compiler_dupstatus = "Memory";
        } else
        if (website.compiler_status.indexOf("Time limit") > -1) {
            website.compiler_dupstatus = "Time limit";
        } else
        if (website.compiler_status.indexOf("Runtime") > -1) {
            website.compiler_dupstatus = "Runtime";
        } else
        if (website.compiler_status.indexOf("Compilation") > -1) {
            website.compiler_dupstatus = "Compilation";
        } else
        if (website.compiler_status.indexOf("Wrong") > -1) {
            website.compiler_dupstatus = "Wrong";
        } else {
            website.compiler_dupstatus = website.compiler_status;
        }
        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO website(id , title , metadata ,source_code ,compiler_status ,compiler_dupstatus, language, level , users_attempted) VALUES (?,?,?,?,?,?,?,?,?)", [website.id, website.title, website.metadata, website.source_code, website.compiler_status, website.compiler_dupstatus, website.language, website.metadata.level, website.metadata.users_attempted]);
        });
    };
    this.getWebsites = function(LIMIT, OFFSET, filterItems, callback) {
        var inItems = "";
        var filterItemsLength = filterItems.length;
        if (filterItemsLength > 0) {
            for (var i = 0; i < filterItemsLength; i++) {
                inItems += '"' + filterItems[i] + '", ';
            }
            inItems = inItems.substr(0, inItems.length - 2);
            inItems = "WHERE compiler_dupstatus in ( " + inItems + " )";
        }
        var queryString = "SELECT * FROM website " + inItems + " LIMIT ? OFFSET ?";
        this.db.transaction(function(tx) {
            tx.executeSql(queryString, [LIMIT, OFFSET], function(tx, result) {
                var rowsLength = result.rows.length;
                var websites = [];
                for (var i = 0; i < rowsLength; i++) {
                    websites.push(JSON.parse(JSON.stringify(result.rows[i])));
                }
                callback(null, websites);
            }, function(tx, e) {
                callback(e);
            });
        });
    }
    this.getTopFiveLanguages = function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT language, count(language) as total FROM website GROUP BY language ORDER BY total DESC LIMIT 5;", [], function(tx, result) {
                var rowsLength = result.rows.length;
                var topLanguages = [];
                for (var i = 0; i < rowsLength; i++) {
                    topLanguages.push(JSON.parse(JSON.stringify(result.rows[i])));
                }
                callback(null, topLanguages);
            }, function(tx, e) {
                callback(e);
            });
        });
    }
    this.getTopTwoSubmissions = function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT title, count(title) as total FROM website GROUP BY title ORDER BY total DESC LIMIT 2;", [], function(tx, result) {
                var rowsLength = result.rows.length;
                var topSubmissions = [];
                for (var i = 0; i < rowsLength; i++) {
                    topSubmissions.push(JSON.parse(JSON.stringify(result.rows[i])));
                }
                callback(null, topSubmissions);
            }, function(tx, e) {
                callback(e);
            });
        });
    }
    this.getSubmissionsCountByLevel = function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT level, count(level) as total FROM website GROUP BY level ORDER BY total DESC ;", [], function(tx, result) {
                var rowsLength = result.rows.length;
                var submissionByLevel = [];
                for (var i = 0; i < rowsLength; i++) {
                    submissionByLevel.push(JSON.parse(JSON.stringify(result.rows[i])));
                }
                callback(null, submissionByLevel);
            }, function(tx, e) {
                callback(e);
            });
        });
    }
    this.getTotalSubmissionsCount = function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT Count(*) as total FROM website;", [], function(tx, result) {
                if (result.rows.length > 0) {
                    callback(null, result.rows[0].total);
                }
            }, function(tx, e) {
                callback(e);
            });
        });
    }
    this.getFilteredSubmissionsCount = function(filterItems, callback) {
        var inItems = "";
        var filterItemsLength = filterItems.length;
        if (filterItemsLength > 0) {
            for (var i = 0; i < filterItemsLength; i++) {
                inItems += '"' + filterItems[i] + '", ';
            }
            inItems = inItems.substr(0, inItems.length - 2);
            inItems = "WHERE compiler_dupstatus in ( " + inItems + " )";
        }
        var queryString = "SELECT Count(*) as total FROM website " + inItems;
        this.db.transaction(function(tx) {
            tx.executeSql(queryString, [], function(tx, result) {
                if (result.rows.length > 0) {
                    callback(null, result.rows[0].total);
                }
            }, function(tx, e) {
                callback(e);
            });
        });
    }
}
var codeCafeDAOObj = new codeCafeDAO();
codeCafeDAOObj.createDB();