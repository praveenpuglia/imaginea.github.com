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
		var headerDiv = $('<div>').addClass('projectDetailsHeader');
		var headingDiv = $('<div>').addClass('projectDetailsHeaderLeft');
		var watchersDiv = $('<div>').addClass('projectDetailsHeaderRight');

		var h3 = $('<h3 id="'+projectName+'_projectHeader">');
		var pDescription = $('<p id="projectDescription">');
		var pDownloadStats = $('<p id="projectLanguage">');
		var pUpdateDate = $('<p id="projectUpdateDate">');
		var pWatchersAndDownloadCount = $('<p id="'+projectName+'_projectWatchersAndDc">').html('<img src="images/watchers_icon.png" class="header_icons"/><label id="'+projectName+'_watcherslabel" class="header_label"></label> <img src="images/downloads_icon.png" class="header_icons" /><label id="'+projectName+'_downloadslabel" class="header_label" ></label>');
		var pSvnUrl = $('<p id="projectSvnUrl">');
		var projectDetailsDiv = $("#projectDetails");

		headingDiv.append(h3);
		watchersDiv.append(pWatchersAndDownloadCount);
		
		headerDiv.append(headingDiv, watchersDiv);
		var rootDiv = $("<div>").append(headerDiv).addClass('projectDetail lifted '+projectName);
		var childDiv = $("<div>").append(pDescription, pDownloadStats, pUpdateDate, pSvnUrl).addClass(projectName);
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
			var projectUpdateDate = new Date(projectData.data.pushed_at).toLocaleDateString();
			var projectWatchers = projectData.data.watchers;
			var projectLanguage = projectData.data.language;
			var projectSvnUrl = projectData.data.svn_url;
			var projectHomePageUrl = projectData.data.homepage;
			
			$('#'+projectName+'_projectHeader').append($('<a>').attr('href', projectHomePageUrl).attr('target', '_blank').text(projectId));
			$('.'+projectName+' > #projectDescription').html(projectDescription);
			$('.'+projectName+' > #projectUpdateDate').html("<label>Update Date: </label>"+projectUpdateDate);
			$('.'+projectName+' > #projectLanguage').html("<label>Language: </label>"+projectLanguage);
			$('#'+projectName+'_watcherslabel').text(projectWatchers);
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
							"FireFlow": { "download_count": 9640, "download_url": "https://addons.mozilla.org/en-US/firefox/addon/fireflow/statistics/?last=30"	},
							"pancake-ios": { "download_count": 290, "download_url": "http://itunes.apple.com/us/app/sugar-on-pancake/id528250369?mt=8"}
						};
					if(downloadStats[projectName])
					{
						$('#'+projectName+'_downloadslabel').html($('<a>').attr('href', downloadStats[projectName].download_url).attr('target', '_blank').text(downloadStats[projectName].download_count));
					}
					else
					{
						$('#'+projectName+'_downloadslabel').text('na');
					}
					break;
				case NaN:
					$('#'+projectName+'_downloadslabel').text('na');
					break;
				default:
					var totalDownloadCount = 0;
					for(var i=0;i<downloadCountArrayLength;i++)
					{
						totalDownloadCount += downloadCountArray.data[i].download_count;
					}
					$('#'+projectName+'_downloadslabel').text(totalDownloadCount);
			}
		});
	};
	return {
		initialize: function(projectName)
		{
			createDiv(projectName);
			createProjectDetailsDisplay(projectName);
			createProjectDownloadStatsDisplay(projectName);
		}
	};
})();
