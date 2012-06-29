var ProjectDetailsLoader = {
	
	load: function()
	{
		var projects = ["mViewer", "bot-bot", "FireFlow", "Matisse", "pancake-ios"];
		var divArray = new Array(5);
		var responseCount = 0;
		var projectDetailsDiv = $("#projectDetails").addClass('projectDetails').css('opacity', '0');
		console.log(projectDetailsDiv);
		$.each(projects, function(index, project)
		{
			var loadProjectDetails = function(project, projectIndex)
			{
				getProjectDetails = function(projectDetails, projectDetailIndex)
				{
					var downloadCountUrl = "https://api.github.com/repos/Imaginea/"+project+"/downloads"
				   getDownloadCount = function(projectDetails, projectOrderIndex)
					{
						_fillDetails = function(downloadsArray, projectData, divOrderIndex)
						{
							getTotalDownloadCount = function(downloadDataArray)
							{
								var totalDownloadCount = 0;
								downloadCountArrayData = downloadDataArray.data;
								downloadCountArrayDataLength = downloadCountArrayData.length;
								if(downloadCountArrayDataLength == 0)
								{
									totalDownloadCount = -1;
								}
								for(var i=0;i<downloadCountArrayDataLength;i++)
								{
									totalDownloadCount += downloadCountArrayData[i].download_count;
								}
								return totalDownloadCount;
							};
							var downloadStats = {
													"FireFlow": {
																	"download_count": 8969,
																	"download_url": "https://addons.mozilla.org/en-US/firefox/addon/fireflow/statistics/?last=30"	
																},
													"pancake-ios": {
																	"download_count": 160,
																	"download_url": "http://itunes.apple.com/us/app/sugar-on-pancake/id528250369?mt=8"
																	}
												};
							var projectId = projectData.data.name;
							var projectDescription = projectData.data.description;
							var projectDownloadCount = getTotalDownloadCount(downloadsArray);
							var projectUpdateDate = new Date(projectData.data.updated_at).toLocaleDateString();
							var projectWatchers = projectData.data.watchers;
							var projectLanguage = projectData.data.language;
							var projectHomePageUrl = projectData.data.homepage;
							
							var h3 = $('<h3>').append($('<a>').attr('href', projectHomePageUrl).attr('target', '_blank').text(projectId));
							//var pDescription = $('<p>').text("Description: "+projectDescription);
							var pDescription = $('<p>').html('<label>Description: </label>'+projectDescription);
							var pDownloadCount = null;
							if(projectDownloadCount == -1)
							{
								var projectDownloadStats = downloadStats[projectId];
								console.log(projectDownloadStats);
								if(projectDownloadStats === undefined)
								{
									pDownloadCount = "";
								}
								else
								{
									pDownloadCount = $('<p>').html("<label>Download Stats: Count: </label>"+projectDownloadStats.download_count+" ").append($('<a>').attr('href', projectDownloadStats.download_url).attr('target', '_blank').text("Link"));
								}
							}
							else
							{	
								pDownloadCount = $('<p>').html("<label>Download Stats: </label>"+projectDownloadCount);
							}
							var pUpdateDate = $('<p>').html("<label>Update Date: </label>"+projectUpdateDate);
							var pWatchers = $('<p>').html("<label>Watchers: </label>"+projectWatchers+" <label>Language: </label>"+projectLanguage);

							var svn_url = $('<p>').html("<label>Github url: </label>").append($("<a>").attr('href', projectData.data.svn_url).attr('target', '_blank').text(projectData.data.svn_url));
							
							var rootDiv = $("<div>").append(h3).addClass('projectDetail lifted');
							var childDiv = $("<div>").append(pDescription, pDownloadCount, pUpdateDate, pWatchers, svn_url);
							rootDiv.append(childDiv);
							divArray[divOrderIndex] = rootDiv;
							
							responseCount++;
							if(responseCount == projects.length)
							{
								for(var i=0;i<responseCount; i++)
								{
									projectDetailsDiv.append(divArray[i]);
								}
								projectDetailsDiv.css('opacity', '');
								$('#loader').hide();
							}
						};
						var context = this;
						var projectName = projectDetails.data.name;
						$.ajax({
							url: 'https://api.github.com/repos/Imaginea/'+projectName+"/downloads?callback=_fillDetails",
							success: function(downloadCountArray){
								context._fillDetails(downloadCountArray, projectDetails, projectOrderIndex);
							},
							dataType: 'jsonp'
						});
					};
					getDownloadCount(projectDetails, projectDetailIndex);
				};
				var self = this;
				$.ajax({
					url: 'https://api.github.com/repos/Imaginea/'+project+"?callback=getProjectDetails",
					success: function(response){
						self.getProjectDetails(response, projectIndex);
					},
					dataType: 'jsonp'
				});
			};
			loadProjectDetails(project, index);
		});
	}
};



