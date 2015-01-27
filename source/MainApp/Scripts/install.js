var accountList = 'Accounts';
var videosList = 'Videos';
var videoImagesList = 'VideoImages';

BrightCove = {};
BrightCove.BCApp = {};



BrightCove.BCApp.Installer = {  
    Get_isListExists: function (listTitle, OnSuccess, OnError) {
        var ctx = SP.ClientContext.get_current();
        var web = ctx.get_web();
        //var lists = web.get_lists();
        var hostWebUrl = this.GetHostWebUrl('SPHostUrl');
        //Using the hostWebContext as an AppContextSite
        hostWebContext = new SP.AppContextSite(ctx, hostWebUrl);

        //must use the hostWebContext to get the list in that site
        var lists = hostWebContext.get_web().get_lists();
        ctx.load(lists);

        ctx.executeQueryAsync(
          function () {
              var listExists = false;
              var le = lists.getEnumerator();
              while (le.moveNext()) {
                  var list = le.get_current();
                  if (list.get_title() == listTitle) {
                      listExists = true;
                      break;
                  }
              }

              OnSuccess(listExists);
          },
          OnError
        );
    },

    GetHostWebUrl: function (name) {
        if (name != null) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        else {
            return "";
        }
    },

    CreateList: function (title, url, templateType, hidden) {

        //Using the App Web as the client context
        clientContext = new SP.ClientContext.get_current();
        var hostWebUrl = this.GetHostWebUrl('SPHostUrl');
        
        //Using the hostWebContext as an AppContextSite
        hostWebContext = new SP.AppContextSite(clientContext, hostWebUrl);


        //Create List Code
        var listCreation = new SP.ListCreationInformation();
        listCreation.set_title(title);
        listCreation.set_templateType(templateType);
        listCreation.set_url(url);

        //must use the hostWebContext to get the list in that site
        var lists = hostWebContext.get_web().get_lists();

        var list = lists.add(listCreation);
        list.set_hidden(hidden);
        list.set_onQuickLaunch(false);
        if (title == accountList) {
            BrightCove.BCApp.Installer.GenerateAccountsListSchema(list);
        }
        if (title == videosList) {
            BrightCove.BCApp.Installer.GenerateVideoListSchema(list);
        }

        if (title == videoImagesList) {
            BrightCove.BCApp.Installer.GenerateVideoImageListSchema(list);
        }

        list.update();
        //Always use the context of the app web to do the work or load and executing
        clientContext.load(list);

        clientContext.executeQueryAsync(function () {
            $('#errorMessage').text("Created List : \"" + title + "\"");            
            var btnClass = $("#btn" + title).attr('class') + ' hidden';
            $("#btn" + title).attr('class',btnClass);
            if (!$('#btn' + accountList).is(':visible') && !$('#btn' + videosList).is(':visible') && !$('#btn' + videoImagesList).is(':visible')) {
                This.ShowNavigationButtons();
            }
        }, function (sender, args) {
            $('#errorMessage').text("Failed to create list : " + title + "</br>Reason : " + args.get_message());
        });
    },

    CreateCustomList: function (name) {
        BrightCove.BCApp.Installer.Get_isListExists(name, function (listExists) {
            if (listExists == false) {
                BrightCove.BCApp.Installer.CreateList(name, "Lists/" + name, SP.ListTemplateType.genericList, false);
            }
        }, function (sender, args) {
            //    alert(args.get_message());
        });
    },

    GenerateAccountsListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Account Name\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'PublisherId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'DefaultVideoPlayerId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'DefaultPlaylistPlayerId\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ReadAPIServiceURL\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'WriteAPIServiceURL\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AuthorsGroupID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ViewersGroupID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Tokens\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AccountAuthorsGroupName\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'AccountViewersGroupName\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },

    GenerateVideoListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ShortDescription\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'LongDescription\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Active\' Type=\'Boolean\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'RelatedLink\' Type=\'URL\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'RelatedLinkText\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'VideoImage\' Type=\'URL\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'ReferenceID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'StartDate\' Type=\'DateTime\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'EndDate\' Type=\'DateTime\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Economic\' Type=\'Choice\' ><CHOICES><CHOICE>Ad Supported</CHOICE><CHOICE>Bronz</CHOICE><CHOICE>Silver</CHOICE><CHOICE>Gold</CHOICE></CHOICES></Field>', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'VideoThumbnail\' Type=\'URL\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Account\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Keywords\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'SPID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },
    GenerateVideoImageListSchema: function (list) {
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Date Picture Taken\' Type=\'DateTime\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Description\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Keywords\' Type=\'Note\' />', true, SP.AddFieldOptions.defaultValue);
        list.get_fields().addFieldAsXml('<Field DisplayName=\'BrightcoveVideoID\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    },

    HideNavigationButtons:function (){
        $('.leftNav .btn').each(function (index, value) {
            if (index > 0) {
                var button = $(this);
                var btnclass = button.attr('class');
                button.attr('class', btnclass + ' disabled');
            }
        });
    },
    ShowNavigationButtons: function () {
        $('.leftNav .btn').each(function (index, value) {
            if (index > 0) {
                var button = $(this);
                var btnclass = button.attr('class').replace('disabled', '');
                button.attr('class', btnclass);
            }
        });
    },
    CheckLists: function () {
        var lists = [accountList, videosList, videoImagesList];
        var showNavigation = true;
        BrightCove.BCApp.Installer.ShowNavigationButtons();
        lists.forEach(function (entry) {
            BrightCove.BCApp.Installer.Get_isListExists(entry, function (listExists) {
                if (listExists == false) {
                    BrightCove.BCApp.Installer.HideNavigationButtons();
                    var btnClass = $("#btn" + entry).attr('class').replace('hidden', '');
                    $("#btn" + entry).attr('class',btnClass);
                }
            }, function (sender, args) {
                $('#errorMessage').text(args.get_message());
            });
        });        
    }
};
_spBodyOnLoadFunctionNames.push("BrightCove.BCApp.Installer.CheckLists");

window.onload = function () {
    //ControlShare();
}

$(document).ready(function () {
    //BrightCove.BCApp.Installer.CheckLists();
});







