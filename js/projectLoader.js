/* Updated Code */
var LoadDetails = (function()
{
	var getJsonResponse = function(requestUrl, callback) {
		$.ajax({
						url: requestUrl,
						success: function(responseData) {
							callback(responseData);
						},
						dataType: 'jsonp'
				});
	};
	
	var createDiv = function(projectName) {
		var h3 = $('<h3 id="projectHeader">');
		var pDescription = $('<p id="projectDescription">');
		var pDownloadStats = $('<p id="projectDownloadStats">');
		var pUpdateDate = $('<p id="projectUpdateDate">');
		var pWatchersAndDownloadCount = $('<p id="projectWatchersAndDc">');
		var pSvnUrl = $('<p id="projectSvnUrl">');
		var projectDetailsDiv = $("#projectDetails").css('opacity', '0');
		var rootDiv = $("<div>").append(h3).addClass('projectDetail lifted '+projectName);
		var childDiv = $("<div>").append(pDescription, pDownloadStats, pUpdateDate, pWatchersAndDownloadCount, pSvnUrl).addClass(projectName);
		rootDiv.append(childDiv);
		projectDetailsDiv.append(rootDiv);
	};
	
	var createProjectDetailsDisplay = function(projectName)
	{
		var context = this;
		var requestUrl = 'https://api.github.com/repos/Imaginea/'+projectName+"?callback=displayDetails";
		getJsonResponse(requestUrl, function(projectData)
		{
			var projectId = projectData.data.name;
			var projectDescription = projectData.data.description;
			var projectUpdateDate = new Date(projectData.data.updated_at).toLocaleDateString();
			var projectWatchers = projectData.data.watchers;
			var projectLanguage = projectData.data.language;
			var projectSvnUrl = projectData.data.svn_url;
			var projectHomePageUrl = projectData.data.homepage;
			
			$('.'+projectName+' > #projectHeader').append($('<a>').attr('href', projectHomePageUrl).attr('target', '_blank').text(projectId));
			$('.'+projectName+' > #projectDescription').html('<label>Description: </label>'+projectDescription);
			$('.'+projectName+' > #projectUpdateDate').html("<label>Update Date: </label>"+projectUpdateDate);
			$('.'+projectName+' > #projectWatchersAndDc').html("<label>Watchers: </label>"+projectWatchers+" <label>Language: </label>"+projectLanguage);
			$('.'+projectName+' > #projectSvnUrl').html("<label>Github url: </label>").append($("<a>").attr('href', projectSvnUrl).attr('target', '_blank').text(projectSvnUrl));
		});
	};
	var createProjectDownloadStatsDisplay = function(projectName)
	{
		var downloadCountUrl = "https://api.github.com/repos/Imaginea/"+projectName+"/downloads";
		getJsonResponse(downloadCountUrl, function(downloadCountArray)
		{
			var downloadCountArrayLength = downloadCountArray.data.length;
			switch(downloadCountArrayLength)
			{
				case 0: 
					var downloadStats = {
							"FireFlow": { "download_count": 8969, "download_url": "https://addons.mozilla.org/en-US/firefox/addon/fireflow/statistics/?last=30"	},
							"pancake-ios": { "download_count": 160, "download_url": "http://itunes.apple.com/us/app/sugar-on-pancake/id528250369?mt=8"}
						};
					if(downloadStats[projectName])
					{
						$('.'+projectName+'> #projectDownloadStats').html("<label>Download Stats: Count: </label>"+downloadStats[projectName].download_count+" ").append($('<a>').attr('href', downloadStats[projectName].download_url).attr('target', '_blank').text("Link"));
					}
					else
					{
						$('.'+projectName+'> #projectDownloadStats').remove();
					}
					break;
				case NaN:
					$('.'+projectName+'> #projectDownloadStats').remove();
					break;
				default:
					var totalDownloadCount = 0;
					for(var i=0;i<downloadCountArrayLength;i++)
					{
						totalDownloadCount += downloadCountArray.data[i].download_count;
					}
					$('.'+projectName+'> #projectDownloadStats').html("<label>Download Stats: </label>"+totalDownloadCount);
			}
		});
	};
	return {
		initialize: function(projectName)
		{
			createDiv(projectName);
			createProjectDetailsDisplay(projectName);
			createProjectDownloadStatsDisplay(projectName)
		}
	}
})();
