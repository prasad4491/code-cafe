angular.module('code-cafe', ['ui.bootstrap', 'hljs']);
angular.module('code-cafe').config(function(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
    });
});
angular.module('code-cafe').controller("code-cafe-ctrl", function($scope, $http) {
    var totalPages = 15;
    //Actually there 1347 pages But we are unable to load that many pages at time. So i am using first 15 pages. 
    for (var page = 1; page < totalPages; page++) {
        $http.get("http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page=" + page)
            .then(function(response) {
                if (response.status === 200) {
                    codeCafeDAOObj.insertWebsites(response.data.websites);
                    if (response.config.url.substr(response.config.url.indexOf("page=") + 5) == 1) {
                        $scope.filterSubmissions();
                    }
                    codeCafeDAOObj.getTopFiveLanguages(function(err, languages) {
                        $scope.languages = languages;
                        $scope.$apply();
                    });
                    codeCafeDAOObj.getTopTwoSubmissions(function(err, topSubmissions) {
                        $scope.topSubmissions = topSubmissions;
                        $scope.$apply();
                    });
                    codeCafeDAOObj.getSubmissionsCountByLevel(function(err, submissionByLevel) {
                        $scope.submissionByLevel = submissionByLevel;
                        $scope.$apply();
                    });
                    codeCafeDAOObj.getTotalSubmissionsCount(function(err, totalSubmissionsCount) {
                        $scope.totalSubmissionsCount = totalSubmissionsCount;
                        $scope.totalItems = totalSubmissionsCount;
                        $scope.$apply();
                    });
                }
            });
    }
    //top 5 languages 
    $scope.languages = [];

    //top 2 submissions 
    $scope.topSubmissions = [];

    //Submissions by level
    $scope.submissionByLevel = [];

    //Total submission count 
    $scope.totalSubmissionsCount = [];

    $scope.$watch('accepted', function(newVal, oldVal) {
        $scope.filterSubmissions();
    });
    $scope.$watch('skipped', function(newVal, oldVal) {
        $scope.filterSubmissions();
    });
    $scope.$watch('memoryOrTime', function(newVal, oldVal) {
        $scope.filterSubmissions();
    });
    $scope.$watch('runtimeOrCompliation', function(newVal, oldVal) {
        $scope.filterSubmissions();
    });
    $scope.$watch('wrong', function(newVal, oldVal) {
        $scope.filterSubmissions();
    });
    $scope.filterSubmissions = function() {
        var filterItems = [];
        if ($scope.accepted) {
            filterItems.push("Accepted");
        }
        if ($scope.skipped) {
            filterItems.push("Skipped");
        }
        if ($scope.memoryOrTime) {
            filterItems.push("Memory");
        }
        if ($scope.memoryOrTime) {
            filterItems.push("Time limit");
        }
        if ($scope.runtimeOrCompliation) {
            filterItems.push("Runtime");
        }
        if ($scope.runtimeOrCompliation) {
            filterItems.push("Compilation");
        }
        if ($scope.wrong) {
            filterItems.push("Wrong");
        }
        codeCafeDAOObj.getWebsites(5, ($scope.currentPage - 1) * 5, filterItems, function(err, websites) {
            $scope.websites = websites;
            $scope.$apply();
        });
        codeCafeDAOObj.getFilteredSubmissionsCount(filterItems, function(err, totalItems) {
            $scope.totalItems = totalItems;
            $scope.$apply();
        });
    };
    $scope.currentPage = 1;
    $scope.$watch('currentPage', function(newVal, oldVal) {
        $scope.filterSubmissions();
    });
    $scope.maxSize = 15;
});