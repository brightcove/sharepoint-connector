var accountList = 'Accounts';
var videosList = 'Videos';
var videoImagesList = 'VideoImages';

//Namespace Object declarations
BrightCove = {};
BrightCove.BCApp = {};

//**************************************************************************************************
//Global Load Operations
//**************************************************************************************************
$(document).ready(function () {
    //Initialize reload button

    //Initialize the current SharePoint context 
    BrightCove.BCApp.Initialize.InitializeSPContext(function () {
        //Get the current working page
        var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();

        //Initialize the menus and breadcrumbs
        BrightCove.BCApp.Menus.Initialize(pageName);

        try {
            //Invoke the main page event
            BrightCove.BCApp.Initialize.InitializePageLoadEvent(pageName);
        }
        catch (err) {

        }
        
    });
});

//Initializes the current context of the SharePoint User
var SPContext = {
    UserId: function () {
        if (this._instance == null) {
            this._instance = '123456';
        }
        return this._instance;
    }
    ,
    SPContext: function (context) {
        if (context != null) {
            this._instance = context;
        }
        return this._instance;
    },
    SPParentWebContext: function (context) {
        if (context != null) {
            this._instance = context;
        }
        return this._instance;
    },
    ContextURLPath: function (url) {
        if (this._instance == null && url != null && url.length > 0) {
            this._instance = url;
        }
        return this._instance;
    },
    ContextAppPath: function (url) {
        if (this._instance == null && url != null && url.length > 0) {
            this._instance = url;
        }
        return this._instance;
    },
    //to be removed
    DataStore: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    //to be removed
    DataStore2: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    VideosList: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    PlayLists: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    BCVideoIDReference: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    Groups: function (array) {
        if (this._instance == null && array != null) {
            this._instance = array;
        }
        return this._instance;
    },
    ViewObject: function (view) {
        if (view != null) {
            this._instance = view;
        }
        return this._instance;
    },
    PageObject: function (view) {
    if (view != null) {
        this._instance = view;
    }
    return this._instance;
}
};

//Global Constructor
BrightCove.BCApp.Initialize = {
    InitializeSPContext: function (PageLoad) {
        var appweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPAppWebUrl'));
        var hostweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPHostUrl'));
        
        var scriptbase = hostweburl + '/_layouts/15/';

        SPContext.ContextURLPath = scriptbase;
        SPContext.ContextAppPath = appweburl;

        function LoadPage() {
            if (window.location.pathname.toLowerCase().indexOf('default.aspx') > -1) {
                BrightCove.BCApp.Pages.Default.PageLoad();
                //Get the current working page
                var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();
                //Initialize the menus and breadcrumbs
                BrightCove.BCApp.Menus.Initialize(pageName);

            } else {
                try {
                    BrightCove.BCApp.SharePoint.ListUtilities.GetListItem(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);
                }
                catch (err) {
                    //Refresh the current page as the SP Context failed to load properly
                    location.href = location.href;
                }
                PageLoad();
            }
        }

        $.getScript(scriptbase + 'SP.js',
            function () {
                $.getScript(scriptbase + 'SP.RequestExecutor.js', function (scriptbase, PageLoad) {
                    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', LoadPage);
                });
            }
        );
    },
    InitializePageLoadEvent: function (pageName) {
        switch (pageName) {
            case 'AccountManagement.aspx':
                BrightCove.BCApp.Pages.AccountManamgentPage.PageLoad();
                break;
            case 'AddVideos.aspx':
                BrightCove.BCApp.Pages.AddVideos.PageLoad();
                break;
            case 'ManageVideos.aspx':
                BrightCove.BCApp.Pages.ManageVideos.PageLoad();
                break;
            case 'ManagePlaylists.aspx':
                BrightCove.BCApp.Pages.ManagePlayLists.PageLoad();
                break;
            default:
                //BrightCove.BCApp.Pages.Default.PageLoad();
                break;
        }
    }
};

//**************************************************************************************************
//Global Static Configurations
//**************************************************************************************************
BrightCove.BCApp.Constants = {
    SharePointConstants: {
        SPListID_Accounts: 'Accounts',
        //SPListID_PlayList: 'Playlist',
        SPListID_VideoList: 'Videos',
        SPListID_HomePageList: 'HomePage',
        SPListID_ImageLibrary: 'VideoImages',
        SPGroupName_AdminGroup: 'BCAdmin',
        SPGroupName_VideoAdminGroup: 'BCVideoAdd'
    },
    AppSelectorConstant: {
        PageNameSelector: '.pageName',
        LoadLogoSelector: '.loadingLogo',
        LeftNav: {
            LNButtonSelector: '.leftNav .btn',
            LNAnchorSelector: '.leftNav a',
            LNSelectedClass: 'btn-primary',
            LNUnSelectedClass: 'btn-default',
            LNFullUnSelectedClass: 'btn btn-default btn-lg btn-block',
            LNFullSelectedClass: 'btn btn-primary btn-lg btn-block'
        },
        CancelEditAccount: '#CancelEditAccount',
        SinglePropertyEditSelector: '#SinglePropertyModal',
        TokenEditSelector: '#TokenPropertyModal',
        AccountGroupEditSelector: '#AccountGroupManagerModal'
    },
    BrightCoveURLConstants: {
        PostURL: 'https://api.brightcove.com/services/post',
        LibraryURL: ''
    }
};

//**************************************************************************************************
//Menu Management
//**************************************************************************************************
BrightCove.BCApp.Menus = {
    Initialize: function (pageName) {
        //Set the menu's default selected state
        $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNAnchorSelector).each(function () {
            var elemid = $(this).data('id');
            if (pageName == elemid) {
                $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNButtonSelector)
                    .removeClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelectedClass)
                    .addClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNUnSelectedClass);

                $(this).parent().addClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNSelectedClass)
                    .removeClass(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNUnSelectedClass);
            }

            //Set the query string params on each of the links
            var queryString = window.location.search;

            if (queryString.indexOf('&spid') > 0) {
                queryString = window.location.search.substring(0, window.location.search.indexOf('&spid'));
            }
            else if (queryString.indexOf('&vid') > 0) {
                queryString = window.location.search.substring(0, window.location.search.indexOf('&vid'));
            }
            else if (queryString.indexOf('&bcvid') > 0) {
                queryString = window.location.search.substring(0, window.location.search.indexOf('&bcvid'));
            }
            $(this).attr('href', $(this).data('id') + queryString);

            if (elemid.indexOf('AccountManagement.aspx') > -1) {
                var elem = $(this);
                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(BrightCove.BCApp.Constants.SharePointConstants.SPGroupName_AdminGroup,
                function (userInGroup) {
                    if (!userInGroup) {
                        elem.parent().remove();
                    }
                });

            }

            if (elemid.indexOf('AddVideos.aspx') > -1) {
                var elem = $(this);
                var isIntoAdminGroup = false;
                var isIntoVideoAdminGroup = false;

                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(BrightCove.BCApp.Constants.SharePointConstants.SPGroupName_AdminGroup,
                function (userInGroup) {
                    if (userInGroup) {
                        isIntoAdminGroup = true;
                    }
                });

                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(BrightCove.BCApp.Constants.SharePointConstants.SPGroupName_VideoAdminGroup,
                function (userInGroup) {
                    if (userInGroup) {
                        isIntoVideoAdminGroup = true;
                    }

                    if (!isIntoAdminGroup && !isIntoVideoAdminGroup) {
                        elem.parent().remove();
                    }
                });

                
                

            }

        });

        //Set the query string params on each of the links
        //$(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNAnchorSelector).each(function () {
            
        //});

        //Set the menu's onclick behaviour
        $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNButtonSelector).click(function () {
            location.href = $(this).children('a').attr('href');
        });
    }
};

//**************************************************************************************************
//Global Functions
//**************************************************************************************************    

//Global Utilities
BrightCove.BCApp.Utilities = {
    GetCurrentPageName: function () {
        return $(BrightCove.BCApp.Constants.AppSelectorConstant.PageNameSelector).val();
    },
    ShowMainPageContent: function () {
        //Show the main content region only after all of the content/data is done loading
        $('.body-content > .row').slideDown();
    },
    SetShowHides: function (preSlideUpDelegate, preSlideDownDelegate, postSlideDownDelegate) {
        $("a[data-toggle='showhide'],button[data-toggle='showhide']").click(function (event) {

            if (preSlideUpDelegate != null) {
                preSlideUpDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideUp($(this));

            if (preSlideDownDelegate != null) {
                preSlideDownDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideDown($(this));

            if (postSlideDownDelegate != null) {
                postSlideDownDelegate($(this));
            }

            event.stopPropagation();
        });
    },
    AddClickEvent: function (element, preSlideUpDelegate, preSlideDownDelegate, postSlideDownDelegate, viewModelData) {
        if (element == null)
            return false;

        element.click(function (event) {

            if (preSlideUpDelegate != null) {
                if (viewModelData != null)
                    preSlideUpDelegate($(this), viewModelData);
                else
                    preSlideUpDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideUp($(this));

            if (preSlideDownDelegate != null) {
                if (viewModelData != null)
                    preSlideDownDelegate($(this), viewModelData);
                else
                    preSlideDownDelegate($(this));
            }

            BrightCove.BCApp.Utilities.TriggerSlideDown($(this));

            if (postSlideDownDelegate != null) {
                if (viewModelData != null)
                    postSlideDownDelegate($(this), viewModelData);
                else
                    postSlideDownDelegate($(this));
            }

            event.stopPropagation();
        });
    },
    TriggerShowHides: function (element) {
        if (element == null)
            return false;
        this.TriggerSlideUp(element);
        this.TriggerSlideDown(element);
    },
    TriggerSlideUp: function (element) {
        if (element == null)
            return false;
        var hide = element.data('hidetarget');
        $(hide).slideUp();
    },
    TriggerSlideDown: function (element) {
        if (element == null)
            return false;
        var target = element.data('target');
        $(target).slideDown();
    },
    ToggleElementVisibility: function (selector) {
        if (selector == null || selector.length < 1)
            return false;
        $(selector).toggleClass('hideSection');
    },
    BindData: function (data) {
        //ko.applyBindings(data, document.getElementById('AccountSelect'));
        ko.applyBindings(data);
    },
    CloneObject: function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },
    CreateBCGuid: function (index, videoName) {
        var date = (new Date()).format("yyyyMMddhhmss");
        videoName = videoName.toLowerCase().replace(' ', '');

        var s1 = 'BCSP';
        var s2 = (videoName.length > 5) ? videoName.substring(0, 4) : videoName;
        var s3 = date;
        var s4 = index;

        var guid = s1 + "-" + s2 + "-" + s3 + "-" + s4;
        return guid.toLowerCase();
    },
    CreateGuid: function (seed) {
        var s1 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var s2 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var s3 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var s4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var guid = s1 + "-4" + s2 + "-3" + s3 + "-2" + s4 + "-1-" + seed;
        return guid.toLowerCase();
    },
    SortByOrderAscending: function (a, b) {
        return ($(a).data('order')) > ($(b).data('order')) ? 1 : -1;
    },
    SortByDateCreatedAscending: function (a, b) {
        return new Date($(a).data('created')) > new Date($(b).data('created'));
    },
    SortByDateStartedAscending: function (a, b) {
        return new Date($(a).data('started')) > new Date($(b).data('started'));
    },
    SortByNameAscending: function (a, b) {
        return ($(a).data('name').toLowerCase()) > ($(b).data('name').toLowerCase()) ? 1: -1;
    },
    SortByOrderDescending: function (a, b) {
        return ($(a).data('order')) < ($(b).data('order')) ? 1 : -1;
    },
    SortByDateCreatedDescending: function (a, b) {
        return (new Date($(a).data('created'))) < (new Date($(b).data('created'))) ? 1 : -1;
    },
    SortByDateStartedDescending: function (a, b) {
        return (new Date($(a).data('started'))) < (new Date($(b).data('started'))) ? 1 : -1;
    },
    SortByNameDescending: function (a, b) {
        return ($(a).data('name').toLowerCase()) < ($(b).data('name').toLowerCase()) ? 1: -1;
    },
    PL_SortByIDAscending: function (a, b) {
        return ($(a).data('id')) > ($(b).data('id')) ? 1 : -1;
    },
    PL_SortByDescAscending: function (a, b) {
        return ($(a).data('desc')) > ($(b).data('desc')) ? 1 : -1;
    },
    PL_SortByNameAscending: function (a, b) {
        return ($(a).data('name').toLowerCase()) > ($(b).data('name').toLowerCase()) ? 1 : -1;
    },
    PL_SortByTypeAscending: function (a, b) {
        return ($(a).data('type').toLowerCase()) > ($(b).data('type').toLowerCase()) ? 1 : -1;
    },
    PL_SortByIDDescending: function (a, b) {
        return ($(a).data('id')) < ($(b).data('id')) ? 1 : -1;
    },
    PL_SortByTypeDescending: function (a, b) {
        return ($(a).data('type')) < ($(b).data('type')) ? 1 : -1;
    },
    PL_SortByDescDescending: function (a, b) {
        return ($(a).data('desc')) < ($(b).data('desc')) ? 1 : -1;
    },
    PL_SortByNameDescending: function (a, b) {
        return ($(a).data('name').toLowerCase()) < ($(b).data('name').toLowerCase()) ? 1 : -1;
    },
    GetQueryStringParameter: function (param) {
        try {
            var params = document.URL.split("?")[1].split("&");
            var strParams = "";
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == param) {
                    return singleParam[1];
                }
            }
        }
        catch (err) {
            console.log('An error occurred while loading the application querystring values: ' + err.toString());
        }
    },
    StripBCToken: function (param) {
        var returnToken = '';

        if (param.indexOf('-') > 0) {
            returnToken = param.substring(param.indexOf('-') + 1);
        }
        else
            returnToken = param;

        return returnToken;
    },
    StripBCTokenType: function (param) {
        var returnToken = '';

        if (param.indexOf('-') > 0) {
            returnToken = param.substring(0, param.indexOf('-'));
        }
        else
            returnToken = param;

        return returnToken;
    },
    PreventEnterKeyPostBack: function (selector) {
        //$("body input:text").keypress(function (e) {
        $(selector).keypress(function (e) {
            if (e.which == 13) {
                return false;
            }
        });
    },
    AddEnterKeyEventToButton: function (textSelector, buttonSelector) {
        $(textSelector).keypress(function (e) {
            if (e.which == 13) {
                $(buttonSelector).trigger('click');
                return false;
            }
        });
    },
    ReadAccountToken: function (account) {
        //Get the corresponding write tokens for each of the accounts listed in the dropdown
        if (account == null || account == undefined)
            return;

        var tokens = account.ReadTokens();
        if (tokens != null && tokens.length > 0) {
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].toLowerCase().indexOf('ead-') > -1) {
                    var tok = tokens[i].split('ead-');
                    return tok[1];
                }
            }
        }
        return '';
    },
    GetCommaSeparatedArray: function (param) {
        if (param == null)
            return [];
        return (param.length > 0) ? param.split(',') : [];
    },
    GetAccountByID: function (itemid, accountList) {
        if (itemid == null || itemid.length < 1)
            return null;

        var match = ko.utils.arrayFirst(accountList, function (item) {
            return item.PropertyId() == itemid;
        });

        if (match) {
            return match;
        }
        return null;
    },
    GetPlaylistByID: function (itemid, accountList) {
        if (itemid == null || itemid.length < 1)
            return null;

        var match = ko.utils.arrayFirst(accountList, function (item) {
            return item.ID() == itemid;
        });

        if (match) {
            return match;
        }
        return null;
    },
    PageRefresh: function () {
        location.href = location.href;
        return false;
    },
    CreateVideoObjectFromListItem: function (oListItem) {
        var newData = new BrightCove.BCApp.DataStructures.VideoData();

        if (oListItem == null || oListItem.get_id == undefined)
            return newData;
        try {
            newData.VideoID = oListItem.get_id();
            if (oListItem.get_item('Title') != null) {
                newData.VideoTitle = oListItem.get_item('Title');
            }
            else {
                newData.VideoTitle = '';
            }

            newData.Account = oListItem.get_item('Account');
            if (oListItem.get_item('SPID') != null) {
                newData.SPID = oListItem.get_item('SPID');
            }
            else {
                newData.SPID = '';
            }
            if (oListItem.get_item('VideoThumbnail') != null) {
                newData.VideoThumbNail = oListItem.get_item('VideoThumbnail').get_url();
            }
            else {
                newData.VideoThumbNail = '';
            }
            if (oListItem.get_item('VideoImage') != null) {
                newData.VideoStillImage = oListItem.get_item('VideoImage').get_url();
            }
            else {
                newData.VideoStillImage = '';
            }
            if (oListItem.get_item('LongDescription') != null) {
                newData.VideoLongDescription = oListItem.get_item('LongDescription');
            }
            else {
                newData.VideoLongDescription = '';
            }
            if (oListItem.get_item('ShortDescription') != null) {
                newData.VideoShortDescription = oListItem.get_item('ShortDescription');
            }
            else {
                newData.VideoShortDescription = '';
            }
            if (oListItem.get_item('RelatedLink') != null) {
                newData.RelatedLink = oListItem.get_item('RelatedLink').get_url();
                newData.RelatedLinkText = oListItem.get_item('RelatedLink').get_description();
            }
            else {
                newData.RelatedLink = '';
                newData.RelatedLinkText = '';
            }
            if (oListItem.get_item('ReferenceID') != null) {
                newData.ReferenceID = oListItem.get_item('ReferenceID');
            }
            else {
                newData.ReferenceID = '';
            }
            if (oListItem.get_item('StartDate') != null) {
                newData.VideoStartDate = oListItem.get_item('StartDate').format('yyyy-MM-dd');                
            }
            else {
                newData.VideoStartDate = '';
            }
            if (oListItem.get_item('EndDate') != null) {
                newData.VideoEndDate = oListItem.get_item('EndDate').format('yyyy-MM-dd');
            }
            else {
                newData.VideoEndDate = '';
            }
            if (oListItem.get_item('Keywords') != null) {
                newData.Keywords = oListItem.get_item('Keywords');
            }
            else {
                newData.Keywords = '';
            }
            if (oListItem.get_item('Economic') != null) {
                newData.Economics = oListItem.get_item('Economic');
            }
            else {
                newData.Economics = '';
            }

            newData.Active = oListItem.get_item('Active');
        }
        catch (err) { }
        //var active = oListItem.get_item('Active');

        //if (active == 'true') {
        //    newData.Active = true;
        //}
        //else
        //    newData.Active = false;
        return newData;
    },
    ValidateURLFormat: function(url){
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(url);
    },
    ReplaceAll: function (string, find, replace)
    {
        try{
            function escapeRegExp(string) {
                return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            }
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }
        catch(error){            
            return '';
        }
    },
    PreventQuotes: function () {
        $('.container').find('input, select, textarea').each(
                    function (index) {
                        var input = $(this);
                        if (input.attr('type') != "button") {
                            input.on('keypress', function (e) {
                                var ingnore_key_codes = [34, 39];
                                if ($.inArray(e.which, ingnore_key_codes) >= 0) {
                                    e.preventDefault();
                                }
                            });
                        }
                    }
                );
    },
    isVideoUploaded: function () {
        $(document).ajaxComplete(function () {
            if (!$('.formContent,.addTitle').is(":visible")) {
                $('#reload').show();
            }
        });
        
    }

};

//Global Messaging
BrightCove.BCApp.Messaging = {
    GuidNotPresent: function () {
        return 'Error creating the unique GUID value. Operation aborted.';
    },
    WriteTokenNotPresent: function () {
        return 'The selected account does not contain a valid write token.'
                    + '\nPlease choose a different account before proceeding.';
    },
    ValidationFailedMessage: function () {
        return 'Please ensure that all required fields have been filled in.';
    },
    ValidationInvalidUrlMessage: function () {
        return 'The URL link text or URL format used on the related link field is invalid. ' 
            + 'Please ensure that the link text field is filled out, and that the URL link '
            + 'format follows the following pattern: \n'
            + '"http://contoso.com" or "http://www.contoso.com" or "ftp://contoso.com" '
            + 'or "https://contoso.com"';
    },
    ValidationInvalidDateRange: function () {
        return 'The date ranges entered are invalid. Please ensure the following: \n'
                + 'If a start date is set, the end date must be greater than the start date \n'
                + 'If only an end date is entered, the end date should be greater than today\'s date';
    }
    ,
    ValidationInvalidQuotes: function () {
        return 'Please ensure to not use quotes.';
    }
};

BrightCove.BCApp.Pages = {
    AccountManamgentPage: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            //Call into SharePoint to retrieve the account data stored
            this.LoadAccountSelectData('#AccountSelectTbl');

            //BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserSiteCollectionAdmin();
            BrightCove.BCApp.SharePoint.ListUtilities.DoesCurrentUserHaveEditRights(function () {
                SPContext.ViewObject().LoadUIEvents();
            }, function () {
                alert('The current user does not have permissions to access this page');
                //SPContext.ViewObject().LoadUIEvents();
            });
        },
        LoadUIEvents: function(){
            //Add Base UI Events
            SPContext.ViewObject().AddAccountBtnEvent('#AddAccountBtn');
            SPContext.ViewObject().CancelEditAccountBtnsEvent('#CancelEditAccount');
            SPContext.ViewObject().EditAccountsBtnEvents('#AccountSelectTbl .mLinks');
            BrightCove.BCApp.Utilities.PreventEnterKeyPostBack(".modal-dialog input:text");
        },
        AddAccountBtnEvent: function (selector) {
            var elem = $(selector);
            var viewData = this.SelectAccountViewObject();

            BrightCove.BCApp.Utilities.AddClickEvent(elem, function (clickedObj, viewData) {
                viewData.CurrentAccount(new BrightCove.BCApp.DataStructures.AccountData());
                viewData.CurrentReadTokens.removeAll();

                $('.NameField > button').removeAttr('style');

            }, null, null, viewData);
        },
        EditAccountsBtnEvents: function (selector) {
            var elem = $(selector);
            var viewData = this.SelectAccountViewObject();

            BrightCove.BCApp.Utilities.AddClickEvent(elem, null, function (clickedObj, viewData) {

                BrightCove.BCApp.Utilities.TriggerSlideUp($(selector));

                var itemId = clickedObj.data('item-id');
                var selAccount = viewData.GetItem(itemId);

                if (selAccount) {
                    BrightCove.BCApp.Utilities.TriggerSlideDown($(selector));
                }
                else
                    alert('The selected account no longer exists. Please refresh this page');

                $('.NameField > button').removeAttr('style');

            }, null, viewData);
        },
        CancelEditAccountBtnsEvent: function (selector) {
            var elem = $(selector);
            var viewData = this.SelectAccountViewObject();

            var newData = new BrightCove.BCApp.DataStructures.AccountData();
            newData.PropertyName = 'New Item';
            newData.PropertyId = '';
            newData.PropertyValue = '';
            newData.AccountAuthorsGroup = '';
            newData.AccountViewersGroup = '';
            newData.AccountAuthorsGroupName = '';
            newData.AccountViewersGroupName = '';
            newData.DefaultVideoPlayerId = '';
            newData.DefaultPlaylistPlayerId = '';
            newData.DefaultPublisherId = '';
            newData.ReadAPIServiceURL = '';
            newData.WriteAPIServiceURL = '';
            newData.ReadTokens = [];
            newData.WriteTokens = [];

            var newObj = ko.mapping.fromJS(newData);
            //CurrentAccount(newData);

            viewData.CurrentAccount(newObj);

            BrightCove.BCApp.Utilities.AddClickEvent(elem);
        },
        LoadAccountSelectData: function (selector) {
            var elem = $(selector);

            var viewData = this.SelectAccountViewObject();
            BrightCove.BCApp.Utilities.BindData(viewData);
        },
        SaveAccountEditData: function (selector) {
            var elem = $(selector);
        },
        DeleteAccountEditData: function (selector) {
            var elem = $(selector);
        },
        SelectAccountViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.AccountSelectViewModel();
            }
            return this._instance;
        }
    },
    AddVideos: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            this.LoadData();
            this.CreateFormTag();

            $('#txtStartDate').datepicker();
            $('#txtEndDate').datepicker();
            BrightCove.BCApp.Utilities.PreventEnterKeyPostBack("#standardFields input:text");
            BrightCove.BCApp.Utilities.PreventQuotes();
            
            

            
        },
        UploadVideo: function () {
            form = document.getElementById("create_video_sample");
            buildRequest(form);
            form.action = document.getElementById("yourAPILocation").value;
            form.submit();
        },
        UpdateVideo: function () {
            form = document.getElementById("update_video_sample");
            buildJSONRequest();
            form.action = document.getElementById("yourAPILocation").value;
            form.submit();
        },
        LoadData: function (selector) {
            var elem = $(selector);
            var videoData = new BrightCove.BCApp.DataStructures.VideoData();

            if (window.location.search.indexOf('&vid') > 0) {
                $('.addTitle').hide();
                $('#videoFileLabel, #create_video').hide();
                $('#videoFile').remove();
                $('.editTitle,#referenceIdLabel,#txtRefereneId').show();
                $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNAnchorSelector).each(function () {
                    if($(this).data('id') == 'AddVideos.aspx') {
                        $(this).text('Edit Video');
                    }
                });

                if ($.isEmptyObject(SPContext.DataStore2) || SPContext.DataStore2.VideoID == undefined) {
                    var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');
                    BrightCove.BCApp.SharePoint.ListUtilities.GetVideoById(vid);
                    return;
                }

                //to be removed
                //Use meaningful data-store for the app
                videoData = SPContext.DataStore2;
            }
            else if (window.location.search.indexOf('&bcvid') > 0) {
                $('.addTitle').hide();
                $('#videoFileLabel, #create_video').hide();
                $('#videoFile').remove();
                $('.editTitle,#referenceIdLabel,#txtRefereneId').show();
                $(BrightCove.BCApp.Constants.AppSelectorConstant.LeftNav.LNAnchorSelector).each(function () {
                    if ($(this).data('id') == 'AddVideos.aspx') {
                        $(this).text('Add Video From Brightcove');
                    }
                });
                //get token
                
                var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('bcvid');
                var acc = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');

                BrightCove.BCApp.Utilities.BindData(SPContext.ViewObject().ViewObject());

                var accountData = BrightCove.BCApp.Utilities.GetAccountByID(acc, SPContext.ViewObject().ViewObject().AccountListData())
                var readToken = BrightCove.BCApp.Utilities.ReadAccountToken(accountData);
                
                BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByID(vid, readToken,
                    function (vData) {
                    var viewData = SPContext.ViewObject().ViewObject();
                    
                    if (vData != null && vData.length > 0) {
                        videoData.Account = vData[0].Account;
                        videoData.VideoID = 0;
                        videoData.SPID = BrightCove.BCApp.Utilities.CreateBCGuid(1, vData[0].VideoTitle);
                        videoData.ReferenceID = vData[0].ReferenceID;
                        videoData.VideoTitle = vData[0].VideoTitle;
                        videoData.VideoThumbNail = '';
                        videoData.VideoStillImage = '';
                        videoData.VideoLongDescription = (vData[0].VideoLongDescription != null) ? vData[0].VideoLongDescription : '';
                        videoData.VideoShortDescription = (vData[0].VideoShortDescription != null) ? vData[0].VideoShortDescription : '';
                        videoData.RelatedLink = (vData[0].RelatedLink != null) ? vData[0].RelatedLink : '';
                        videoData.RelatedLinkText = (vData[0].RelatedLinkText != null) ? vData[0].RelatedLinkText : '';
                        videoData.Keywords = (vData[0].Keywords != null) ? vData[0].Keywords : '';
                        videoData.VideoStartDate = (vData[0].VideoStartDate != null && vData[0].VideoStartDate != 'Invalid Date') ? vData[0].VideoStartDate : '';
                        videoData.VideoEndDate = (vData[0].VideoEndDate != null && vData[0].VideoEndDate != 'Invalid Date') ? vData[0].VideoEndDate : '';
                        videoData.Active = vData[0].Active;
                        videoData.Economics = vData[0].Economics;
                    }

                    viewData.VideoData(ko.mapping.fromJS(ko.mapping.toJS(videoData)));
                    SPContext.ViewObject().SetSelectedDisabledAccount();
                }, null);

                return;
            }
            else {
                
                

                
                videoData.Account = '';
                videoData.SPID = BrightCove.BCApp.Utilities.CreateBCGuid(1, 'New Video Item');
                videoData.VideoID = -1;
                videoData.VideoTitle = '';
                videoData.VideoThumbNail = '';
                videoData.VideoStillImage = '';
                videoData.VideoLongDescription = '';
                videoData.VideoShortDescription = '';
                videoData.RelatedLink = 'http://www.brightcove.com';
                videoData.RelatedLinkText = 'Brightcove';
                videoData.ReferenceID = '';
                videoData.Keywords = 'tag1,tag2';
                videoData.VideoStartDate = '';
                videoData.VideoEndDate = '';
                videoData.Active = 'ACTIVE';
                videoData.Economics = 'FREE';

                SPContext.DataStore2 = videoData;
            }

            var viewData = this.ViewObject();
            BrightCove.BCApp.Utilities.BindData(viewData);

            viewData.VideoData(ko.mapping.fromJS(ko.mapping.toJS(videoData)));

            this.SetSelectedDisabledAccount();
            //viewData.FilterVideosByCurrentAccount();
        },
        ViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.AddVideosViewModel();
            }
            return this._instance;
        },
        CreateFormTag: function () {
            //Create the embedded form tag in JScript since SharePoint strips all embedded form tags from the app
            var nme = $("div#create_video");
            var newMe = $("<form>");

            for (var i = 0; i < nme[0].attributes.length; i++) {
                var myAttr = nme[0].attributes[i].nodeName;
                var myAttrVal = nme[0].attributes[i].value;
                newMe.attr(myAttr, myAttrVal);
            }
            newMe.html(nme.html());
            nme.replaceWith(newMe);
        },
        SetSelectedDisabledAccount: function () {
            if (window.location.search.indexOf('&account=') > 0) {
                var account = BrightCove.BCApp.Utilities.GetQueryStringParameter('account');
                var selectedVal = $('#ddlSelectAccount > option[data-item-id="' + account + '"]').val();
                $('#ddlSelectAccount').val(selectedVal);
                $('#ddlSelectAccount').attr('disabled', 'disabled');
            }
        }
    },
    ManageVideos: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            this.SearchEvent();
            BrightCove.BCApp.SharePoint.ListUtilities.GetListItem(
                BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            BrightCove.BCApp.Utilities.AddEnterKeyEventToButton('input#searchBox', '.searchButton > button');
        },
        LoadData: function (selector) {
            var elem = $(selector);
            
            var viewData = this.ViewObject();
            BrightCove.BCApp.Utilities.BindData(viewData);
        },
        ViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.ManageVideosViewModel();
            }
            return this._instance;
        },
        SearchEvent: function () {
            $("#searchBox").keyup(function (event) {
                event.stopPropagation();
                event.preventDefault();
                return false;

                //if (event.keyCode == 13) {
                //    alert('caught!');
                //    $('#searchButton').click();
                //    return false;
                //}
            });
        }
    },
    ManagePlayLists: {
        PageLoad: function (param1, param2) {
            SPContext.ViewObject(this);
            this.CreateFormTag();

            BrightCove.BCApp.SharePoint.ListUtilities.GetSPVideos(
                function () {
                    SPContext.ViewObject().LoadData();
                });

            //this.LoadData();

            //var viewData = this.ViewObject();
            //alert('length is: ' + this.ViewObject().viewData.AccountListData().length);
            //BrightCove.BCApp.SharePoint.ListUtilities.TestIsMember('Owners',
            //            function (doesUserBelong) {
            //                alert('done')
            //                if (!doesUserBelong) {
            //                    alert('testing...')
            //                    //validatedAccounts.push(item);
            //                    //me.DeleteItem(item.PropertyId());
            //                }
            //            }); 
        },
        ViewObject: function () {
            if (this._instance == null) {
                this._instance = new BrightCove.BCApp.ViewModels.ManagePlaylistsViewModel();
            }
            return this._instance;
        },
        LoadData: function (selector) {

            var elem = $(selector);
            var viewData = this.ViewObject();

            var readToken = '';

            //alert('length is: ' + alert(viewData.AccountListData().length));
            if (viewData.AccountListData().length > 0)
            {
                for(var i = 0; i < viewData.AccountListData().length; i++)
                {
                    readToken = viewData.GetReadToken(viewData.AccountListData()[i]);
                    if (readToken.length > 0) {
                        break;
                    }
                }
            }

            //get the videos from the sp context
            //playListData = SPContext.DataStore2;

            BrightCove.BCApp.Utilities.BindData(viewData);

            viewData.AddClickEventsToPage();
        },
        CreateFormTag: function () {
            //Create the embedded form tag in JScript since SharePoint strips all embedded form tags from the app

            var nme = $("div#create_playlist");
            var newMe = $("<form>");

            for (var i = 0; i < nme[0].attributes.length; i++) {
                var myAttr = nme[0].attributes[i].nodeName;
                var myAttrVal = nme[0].attributes[i].value;
                newMe.attr(myAttr, myAttrVal);
            }
            newMe.html(nme.html());
            nme.replaceWith(newMe);
        }
    },
    Default: {
        PageLoad: function (param1, param2) {
            //_spBodyOnLoadFunctionNames.push("BrightCove.BCApp.Installer.CheckLists");
            BrightCove.BCApp.Installer.CheckLists();
            
        }
    },
    Installer: {
        PageLoad: function (param1, param2) {
        }
    }
};

//**************************************************************************************************
//Page View Models Functions
//**************************************************************************************************  
BrightCove.BCApp.ViewModels = {
    AccountSelectViewModel: function () {
        var me = this;

        /*************************************************************/
        /*View Model Observables*/
        /*************************************************************/
        me.AccountListData = ko.observableArray([]);
        me.CurrentAccount = ko.observable(BrightCove.BCApp.DataStructures.AccountData);

        //Values for the modal windows
        me.CurrentModalTitleString = ko.observable('Test Title');
        me.CurrentModalValueString = ko.observable('Test Value');
        me.CurrentModalValueDescription = ko.observable('Test Value');

        //Values for token modals
        me.CurrentEditingProperty = ko.observable();
        me.CurrentTokenIndexProperty = ko.observable();
        me.CurrentReadTokens = ko.observableArray([]);

        /*************************************************************/
        /*Account UI Functions*/
        /*************************************************************/
        me.AddItem = function (item) {
            me.AccountListData.push(item);
        };
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        //Returns an observable item from the array
        me.GetItem = function (itemid) {
            if (itemid.length < 1)
                return item;

            var match = ko.utils.arrayFirst(me.AccountListData(), function (item) {
                return item.PropertyId() === itemid;
            });

            if (match) {
                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(match));
                me.CurrentAccount(cloneObj);

                //me.CurrentReadTokens(cloneObj.ReadTokens());
                me.CurrentReadTokens(ko.mapping.toJS(cloneObj.ReadTokens()));
                return match;
            }
            return null;
        };
        me.ShowPropModal = function (ViewData, Event) {
            $('.NameField > button').removeAttr('style');

            //Verify which element invoked the click event, and set the corresponding titles/values for the modal dialog
            var element = $(Event.currentTarget);
            var fieldType = element.data('field-type');
            var description = element.parent().parent().find('td:last').html()
            me.CurrentModalValueDescription(description);

            me.CurrentEditingProperty(fieldType);

            if (me.CurrentAccount().PropertyId == null) {
                me.CurrentModalTitleString('Account Name');
                switch (fieldType) {
                    case 'AccountName':
                        me.CurrentModalTitleString('Account Name');
                        me.CurrentModalValueString('');
                        break;
                    case 'PublisherId':
                        me.CurrentModalTitleString('Publisher Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'VideoPlayerId':
                        me.CurrentModalTitleString('Video Player Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'PlayListId':
                        me.CurrentModalTitleString('PlayList Id');
                        me.CurrentModalValueString('');
                        break;
                    case 'ReadAPIServiceURL':
                        me.CurrentModalTitleString('Read API Service URL');
                        me.CurrentModalValueString('');
                        break;
                    case 'WriteAPIServiceURL':
                        me.CurrentModalTitleString('Write API Service URL');
                        me.CurrentModalValueString('');
                        break;
                }
            }
            else {
                switch (fieldType) {
                    case 'AccountName':
                        me.CurrentModalTitleString('Account Name');
                        me.CurrentModalValueString(me.CurrentAccount().PropertyName());
                        break;
                    case 'PublisherId':
                        me.CurrentModalTitleString('Publisher Id');
                        me.CurrentModalValueString(me.CurrentAccount().DefaultPublisherId());
                        break;
                    case 'VideoPlayerId':
                        me.CurrentModalTitleString('Video Player Id');
                        me.CurrentModalValueString(me.CurrentAccount().DefaultVideoPlayerId());
                        break;
                    case 'PlayListId':
                        me.CurrentModalTitleString('PlayList Id');
                        me.CurrentModalValueString(me.CurrentAccount().DefaultPlaylistPlayerId());
                        break;
                    case 'ReadAPIServiceURL':
                        me.CurrentModalTitleString('Read API Service URL');
                        me.CurrentModalValueString(me.CurrentAccount().ReadAPIServiceURL());
                        break;
                    case 'WriteAPIServiceURL':
                        me.CurrentModalTitleString('Write API Service URL');
                        me.CurrentModalValueString(me.CurrentAccount().WriteAPIServiceURL());
                        break;
                }
            }
            $(BrightCove.BCApp.Constants.AppSelectorConstant.SinglePropertyEditSelector).modal('show');
        };

        /*************************************************************/
        /*Token Functions*/
        /*************************************************************/
        me.ShowTokenPropModal = function (ViewData, Event) {
            var element = $(Event.currentTarget);
            var itemIndex = element.data('item-index');
            me.CurrentModalTitleString('Edit Token');

            $('.NameField > button').removeAttr('style');
            $('#deleteToken').show();

            if (itemIndex != null && itemIndex != undefined && itemIndex > -1)
                me.CurrentTokenIndexProperty(itemIndex);
            
            //Verify which element invoked the click event, and set the corresponding titles/values for the modal dialog
            if (me.CurrentTokenIndexProperty() == -1) {
                $('#deleteToken').hide();
                me.CurrentModalValueString('');
                $('#TokenPropertyModal .modal-body > input').val('New Token');
            } else {
                me.CurrentModalValueString(element.text().trim());
            }

            $('#TokenPropertyModal .modal-body > input').val(element.text().trim());
            $('#TokenTypeSelect').val(element.data('token-type'));
            $(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('show');
        };
        me.AddToken = function (ViewData, Event) {
            me.CurrentTokenIndexProperty(-1);
            me.ShowTokenPropModal(ViewData, Event);
        };
        me.SaveTokenPropertyChange = function () {
            var val = $('#TokenPropertyModal .modal-body > input').val();
            var fullVal = $('#TokenTypeSelect option:selected').val()
                + '-' + $('#TokenPropertyModal .modal-body > input').val();

            if (me.CurrentTokenIndexProperty() == -1) {

                me.CurrentTokenIndexProperty(0);

                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(me.CurrentReadTokens()));
                cloneObj().push(fullVal);
                me.CurrentReadTokens(cloneObj());

                $('#AccountTokensTbl tr.tokenData:last > td:eq(1)')
                    .html($('#TokenTypeSelect option:selected').text());
            }
            else {
                //var item = me.CurrentAccount().ReadTokens();
                me.CurrentReadTokens()[me.CurrentTokenIndexProperty()] = fullVal;
                $('#AccountTokensTbl tr.tokenData:eq(' + me.CurrentTokenIndexProperty()
                    + ') > td:eq(0) > button > span').html(val);
                $('#AccountTokensTbl tr.tokenData:eq(' + me.CurrentTokenIndexProperty()
                    + ') > td:eq(1)').html($('#TokenTypeSelect option:selected').text());
            }
            $(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('hide');
        };
        me.DeleteToken = function () {
            if (me.CurrentTokenIndexProperty() > -1) {
                me.CurrentReadTokens().splice(me.CurrentTokenIndexProperty(), 1);
                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(me.CurrentReadTokens()));
                me.CurrentReadTokens(cloneObj());

                me.CurrentTokenIndexProperty(-1);
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('hide');
        };
        me.FormatToken = function (param) {
            return BrightCove.BCApp.Utilities.StripBCToken(param);
        };
        me.FormatTokenType = function (param) {
            return BrightCove.BCApp.Utilities.StripBCTokenType(param);
        };

        /*************************************************************/
        /*Modal Window Functions*/
        /*************************************************************/
        me.ShowGroupsPropModal = function (ViewData, Event) {
            $('.NameField > button').removeAttr('style');

            var element = $(Event.currentTarget);
            me.CurrentModalTitleString('Edit Group');
            var fieldType = element.data('field-type');

            switch (fieldType) {
                case 'AuthorsGroup':
                    me.CurrentEditingProperty(fieldType);
                    $('#AuthorsGroupSelect').val(me.CurrentAccount().AccountAuthorsGroupName());
                    me.CurrentModalValueString(me.CurrentAccount().AccountAuthorsGroupName());
                    break;
                case 'ViewersGroup':
                    me.CurrentEditingProperty(fieldType);
                    $('#AuthorsGroupSelect').val(me.CurrentAccount().AccountViewersGroupName());
                    me.CurrentModalValueString(me.CurrentAccount().AccountViewersGroupName());
                    break;
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.AccountGroupEditSelector).modal('show');
        };
        me.SaveGroupsPropModal = function (ViewData, Event) {
            var val = $('#AuthorsGroupSelect option:selected').val();
            me.CurrentModalValueString(val);
            switch (me.CurrentEditingProperty()) {
                case 'AuthorsGroup':
                    me.CurrentAccount().AccountAuthorsGroupName(val);

                    break;
                case 'ViewersGroup':
                    me.CurrentAccount().AccountViewersGroupName(val);
                    break;
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.AccountGroupEditSelector).modal('hide');
        };
        me.CancelEdits = function () {
            $(BrightCove.BCApp.Constants.AppSelectorConstant.CancelEditAccount).trigger('click');
        };
        me.SaveSinglePropertyChange = function () {

            if (me.CurrentAccount().PropertyName == null) {
                var newData = new BrightCove.BCApp.DataStructures.AccountData();
                newData.PropertyName = 'New Item';
                newData.PropertyId = '';
                newData.PropertyValue = '';
                newData.AccountAuthorsGroup = '';
                newData.AccountViewersGroup = '';
                newData.AccountAuthorsGroupName = '';
                newData.AccountViewersGroupName = '';
                newData.DefaultVideoPlayerId = '';
                newData.DefaultPlaylistPlayerId = '';
                newData.DefaultPublisherId = '';
                newData.ReadAPIServiceURL = '';
                newData.WriteAPIServiceURL = '';
                newData.ReadTokens = [];
                newData.WriteTokens = [];

                var newObj = ko.mapping.fromJS(newData);
                me.CurrentAccount(newObj);
            }

            switch (me.CurrentEditingProperty()) {
                case 'AccountName':
                    me.CurrentAccount().PropertyName(me.CurrentModalValueString());
                    break;
                case 'PublisherId':
                    me.CurrentAccount().DefaultPublisherId(me.CurrentModalValueString());
                    break;
                case 'VideoPlayerId':
                    me.CurrentAccount().DefaultVideoPlayerId(me.CurrentModalValueString());
                    break;
                case 'PlayListId':
                    me.CurrentAccount().DefaultPlaylistPlayerId(me.CurrentModalValueString());
                    break;
                case 'ReadAPIServiceURL':
                    me.CurrentAccount().ReadAPIServiceURL(me.CurrentModalValueString());
                    break;
                case 'WriteAPIServiceURL':
                    me.CurrentAccount().WriteAPIServiceURL(me.CurrentModalValueString());
                    break;
            }

            //alert('Item saved - SaveSinglePropertyChange');
            $(BrightCove.BCApp.Constants.AppSelectorConstant.SinglePropertyEditSelector).modal('hide');
        };

        /*************************************************************/
        /*SP Crud Functions*/
        /*************************************************************/
        me.AddGroupData = function () {
            //alert('test completed');
            me.CurrentTokenIndexProperty(-1);
            me.CurrentModalValueString('');
            me.ShowTokenPropModal();
            //$(BrightCove.BCApp.Constants.AppSelectorConstant.TokenEditSelector).modal('show');
        };
        me.AddAccount = function (ViewData, Event) {
            var element = $(Event.currentTarget).children('a#AddAccountBtn').trigger('click');
        };
        me.SaveAccountChanges = function () {
            var r = confirm("Are you sure that the changes should be saved?");
            if (!r) {
                return;
            }

            var match = ko.utils.arrayFirst(me.AccountListData(), function (item) {
                return item.PropertyId() === me.CurrentAccount().PropertyId();
            });

            if (me.CurrentAccount().PropertyName() == null || me.CurrentAccount().PropertyName().length < 1) {
                alert('Please ensure that an account name has been added before saving the information');
                $('.NameField > button').attr('style', 'background-color:red');
                return false;
            }

            $('.NameField > button').removeAttr('style');

            if (match) {
                match.PropertyName(me.CurrentAccount().PropertyName());
                match.PropertyValue(me.CurrentAccount().PropertyValue());
                match.AccountAuthorsGroup(me.CurrentAccount().AccountAuthorsGroup());
                match.AccountViewersGroup(me.CurrentAccount().AccountViewersGroup());
                match.AccountAuthorsGroupName(me.CurrentAccount().AccountAuthorsGroupName());
                match.AccountViewersGroupName(me.CurrentAccount().AccountViewersGroupName());
                match.DefaultVideoPlayerId(me.CurrentAccount().DefaultVideoPlayerId());
                match.DefaultPlaylistPlayerId(me.CurrentAccount().DefaultPlaylistPlayerId());
                match.DefaultPublisherId(me.CurrentAccount().DefaultPublisherId());
                match.ReadAPIServiceURL(me.CurrentAccount().ReadAPIServiceURL());
                match.WriteAPIServiceURL(me.CurrentAccount().WriteAPIServiceURL());
                match.ReadTokens(me.CurrentReadTokens());
                match.WriteTokens(me.CurrentAccount().WriteTokens());

                me.CurrentAccount().ReadTokens(me.CurrentReadTokens());

                BrightCove.BCApp.SharePoint.ListUtilities.UpdateListItem(me.CurrentAccount());
                //alert('Item saved - SaveAccountChanges');
            }
            else {
                me.CurrentAccount().PropertyId(BrightCove.BCApp.Utilities.CreateGuid(me.CurrentAccount().PropertyName()));
                me.AccountListData.push(me.CurrentAccount());

                me.CurrentAccount().ReadTokens(me.CurrentReadTokens());

                BrightCove.BCApp.SharePoint.ListUtilities.AddAccountItem(me.CurrentAccount());

                //alert('Item added to list - SaveAccountChanges');
            }

            $(BrightCove.BCApp.Constants.AppSelectorConstant.CancelEditAccount).trigger('click');
        };
        me.DeleteAccount = function () {
            var r = confirm("This account will be permanently deleted. Are you sure you want to proceed?");
            if (!r) {
                return;
            }
            BrightCove.BCApp.SharePoint.ListUtilities.DeleteListItem(me.CurrentAccount());
            me.DeleteItem(me.CurrentAccount().PropertyId());
            $(BrightCove.BCApp.Constants.AppSelectorConstant.CancelEditAccount).trigger('click');
        };

        /*************************************************************/
        /*Data Binding Functions*/
        /*************************************************************/
        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(
            BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

        ko.mapping.fromJSON(returnData, {}, me);
    },
    AddVideosViewModel: function () {
        var me = this;
        var writeToken = '';
        
        /*************************************************************/
        /*View Model Observables*/
        /*************************************************************/
        me.AccountListData = ko.observableArray([]);
        me.VideoData = ko.observable(BrightCove.BCApp.DataStructures.VideoData);
        me.CurrentAccount = ko.observable(BrightCove.BCApp.DataStructures.AccountData);

        /*************************************************************/
        /*SharePoint Doc Library Upload Functions*/
        /*************************************************************/
        me.AddVideo = function (ViewData, Event) {
            //Format the data before submitting
            var cont = true;

            writeToken = $('#ddlSelectAccount > option:selected').val();
            var selectedAccountName = $('#ddlSelectAccount > option:selected').text();
            var accountId = $('#ddlSelectAccount > option:selected').data('item-id');

            me.CurrentAccount(BrightCove.BCApp.Utilities.GetAccountByID(accountId, me.AccountListData()));

            if (writeToken.length < 1) {
                alert(BrightCove.BCApp.Messaging.WriteTokenNotPresent());
                return false;
            }
            //Run through validation

            //Validate the link url format
            var link = me.VideoData().RelatedLink();
            var linkText = me.VideoData().RelatedLinkText();
            if (link != null && link.length > 0
                && !BrightCove.BCApp.Utilities.ValidateURLFormat(link)) {
                $('#txtRelatedLinkURL').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidUrlMessage());
                return false;
            }
            if (link != null && link.length > 0 && linkText != null && linkText.length < 1) {
                $('#txtRelatedLinkText').addClass('notValid');
                $('#txtRelatedLinkURL').removeClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidUrlMessage());
                return false;
            } else if (linkText != null && linkText.length > 0 && link != null && link.length < 1) {
                $('#txtRelatedLinkURL').addClass('notValid');
                $('#txtRelatedLinkText').removeClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidUrlMessage());
                return false;
            }

            var startDate = me.VideoData().VideoStartDate();
            var endDate = me.VideoData().VideoEndDate();

            if (startDate.length > 0) {
                if (endDate.length > 0) {
                    var sd = new Date(startDate);
                    var ed = new Date(endDate);

                    if (ed < sd) {
                        $('#txtEndDate').addClass('notValid');
                        $('#txtStartDate').addClass('notValid');
                        alert(BrightCove.BCApp.Messaging.ValidationInvalidDateRange());
                        return false;
                    }
                }             
            }

            if (endDate.length > 0) {
                $('#txtStartDate').removeClass('notValid');
                var sd = new Date();
                var ed = new Date(endDate);

                if (ed < sd) {
                    $('#txtEndDate').addClass('notValid');
                    alert(BrightCove.BCApp.Messaging.ValidationInvalidDateRange());
                    return false;
                }
            }            

            if ($('#txtName').val().indexOf('"') > -1) {
                $('#txtName').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            if ($('#txtShortDescription').val().indexOf('"') > -1) {
                $('#txtShortDescription').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            if ($('#ctl00_PlaceHolderMain_txtLongDescription').val().indexOf('"') > -1) {
                $('#ctl00_PlaceHolderMain_txtLongDescription').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            if ($('#txtRelatedLinkURL').val().indexOf('"') > -1) {
                $('#txtRelatedLinkURL').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            if ($('#txtRelatedLinkText').val().indexOf('"') > -1) {
                $('#txtRelatedLinkText').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }

            if ($('#brightcoveTags').val().indexOf('"') > -1) {
                $('#brightcoveTags').addClass('notValid');
                alert(BrightCove.BCApp.Messaging.ValidationInvalidQuotes());
                return false;
            }
            
            $('#ctl00_PlaceHolderMain_txtLongDescription').removeClass('notValid');
            $('#txtShortDescription').removeClass('notValid');
            $('#txtName').removeClass('notValid');
            $('#brightcoveTags').removeClass('notValid');

            $('#txtStartDate').removeClass('notValid');
            $('#txtEndDate').removeClass('notValid');
            $('#txtRelatedLinkURL').removeClass('notValid');
            $('#txtRelatedLinkText').removeClass('notValid');

            //Validate the images and video input fields
            var vid = (me.VideoData().VideoID != undefined) ? me.VideoData().VideoID() : 0;
            var refId = (me.VideoData().ReferenceID != undefined) ? me.VideoData().ReferenceID() : 0;

            if (vid != null && vid != undefined && vid > 0) {
                $('#videoStill').removeClass('validate');
                $('#thumbnail').removeClass('validate');
            }

            $('.validate').each(function () {
                var val = $(this).val();

                if (val.length < 1) {
                    $(this).addClass('notValid');
                    cont = false;
                }
                else {
                    $(this).removeClass('notValid');
                }
            });

            //If validation failed, do not continue with execution
            if (!cont) {
                alert(BrightCove.BCApp.Messaging.ValidationFailedMessage());
                return false;
            }

            //Create a unique GUID and append it to the object
            if (vid == null || vid == undefined || vid == 0) {
                me.VideoData().SPID(BrightCove.BCApp.Utilities.CreateBCGuid('1', me.VideoData().VideoTitle()));
            }
            
            //Get the un-bound values directly from the HTML elements before information is submitted to SP
            me.VideoData().Economics($('#ddlEconomics > option:selected').val());
            me.VideoData().Account($('#ddlSelectAccount > option:selected').text());
            var activeVar = $('#ddlActive > option:selected').val();

            //Upload the video data asynchronously
            if (vid == 0 && refId > 0) {
                BrightcoveUpload(function () {
                    GetImageFileBuffer('BCStill-', '#videoStill').done(function (result) {
                        me.VideoData().VideoStillImage('/'
                            + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                            + '/' + result.filename);

                        //Upload the still image item to the doc library
                        UploadSPDocument(result.filename, result.content).done(function (data) {
                            GetImageFileBuffer('BCThumb-', '#thumbnail').done(function (resultn) {
                                me.VideoData().VideoThumbNail('/'
                                    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                    + '/' + resultn.filename);

                                //Upload the thumbnail image item to the doc library
                                UploadSPDocument(resultn.filename, resultn.content).done(function (datan) {
                                    //Upload SharePoint video data
                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());

                                    $('.formContent,.addTitle').hide();
                                    //$('#reload').show();
                                    //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                })
                            }).fail(function (errn) {
                                var e = errn;
                                alert(e);
                            });
                        })
                    }).fail(function (err) {
                        var e = err;
                        alert(e);
                    });
                });
            }
            else {
                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(me.CurrentAccount().AccountAuthorsGroupName(),
                    function (userInGroup, UploadVideo) {
                        if (!userInGroup) {
                            alert('The current user does not belong to the author\'s group configured in the selected account. The video details will not be uploaded.');
                            return;
                        } else {
                            BrightcoveUpload(function () {
                                var doneWithStillUpload = false;
                                var doneWithThumbUpload = false;
                                var isNewSPVid = false;

                                function showReloadFields(stillUploadStatus, thumbUploadStatus) {
                                    if (stillUploadStatus && thumbUploadStatus) {
                                        $('.formContent,.addTitle').hide();
                                        $('#reload').show();
                                    }
                                }
                                //alert('beginning sp upload');

                                if (vid == 0 && refId > 0) {
                                    GetImageFileBuffer('BCStill-', '#videoStill').done(function (result) {
                                        me.VideoData().VideoStillImage('/'
                                            + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                            + '/' + result.filename);

                                        //Upload the still image item to the doc library
                                        UploadSPDocument(result.filename, result.content).done(function (data) {
                                            GetImageFileBuffer('BCThumb-', '#thumbnail').done(function (resultn) {
                                                me.VideoData().VideoThumbNail('/'
                                                    + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                                    + '/' + resultn.filename);

                                                //Upload the thumbnail image item to the doc library
                                                UploadSPDocument(resultn.filename, resultn.content).done(function (datan) {
                                                    //Upload SharePoint video data
                                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());
                                                    doneWithThumbUpload = true;
                                                    //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                                })
                                            }).fail(function (errn) {
                                                var e = errn;
                                                alert(e);
                                            });
                                        })
                                    }).fail(function (err) {
                                        var e = err;
                                        alert(e);
                                    });
                                }
                                else {
                                    //Upload SharePoint video data
                                    //if (vid != null && vid != undefined && vid > 0) {
                                        
                                    //}
                                    BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData(),
                                            function (oListItem) {
                                                var spvid = oListItem.get_id();
                                                me.VideoData().VideoID(spvid);

                                                try {
                                                    GetImageFileBuffer('BCStill-', '#videoStill').done(function (result) {
                                                        me.VideoData().VideoStillImage('/'
                                                            + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                                            + '/' + result.filename);

                                                        //Upload the still image item to the doc library
                                                        UploadSPDocument(result.filename, result.content).done(function (data) {
                                                            //var file = data.d;
                                                            //checkOut(file.ServerRelativeUrl).done(function () {
                                                            //    updateMetadata(file.ServerRelativeUrl, null).done(function () {
                                                            //        checkIn(file.ServerRelativeUrl).done(function () { });
                                                            //    })
                                                            //})
                                                            //alert('Done uploading still image');
                                                            
                                                            //BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());
                                                            doneWithStillUpload = true;
                                                            //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                                        })
                                                    }).fail(function (err) {
                                                        var e = err;
                                                        alert(e);
                                                    });
                                                }
                                                catch (err) { }

                                                try {
                                                    GetImageFileBuffer('BCThumb-', '#thumbnail').done(function (resultn) {
                                                        me.VideoData().VideoThumbNail('/'
                                                            + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                                                            + '/' + resultn.filename);

                                                        //Upload the thumbnail image item to the doc library
                                                        UploadSPDocument(resultn.filename, resultn.content).done(function (datan) {
                                                            //Upload SharePoint video data
                                                            BrightCove.BCApp.SharePoint.ListUtilities.AddVideoItem(me.VideoData());
                                                            doneWithThumbUpload = true;
                                                            //showReloadFields(doneWithStillUpload, doneWithThumbUpload);
                                                        })
                                                    }).fail(function (errn) {
                                                        var e = errn;
                                                        alert(e);
                                                    });
                                                }
                                                catch (err) { }
                                            });
                                }

                                showReloadFields(true, true);
                            });
                        }
                    });
            }
        };

        me.GetWriteToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('write-') > -1) {
                        var tok = tokens[i].split('rite-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.GetReadToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('ead-') > -1) {
                        var tok = tokens[i].split('ead-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.PageRefresh = function () {
            BrightCove.BCApp.Utilities.PageRefresh();
        };
        me.GetAddNewVideoLink = function () {
            var base = $('.leftNav a[href^="AddVideos.aspx"]').attr('href');
            //return base + '&spid=' + param + '&vid=' + param2;

            if (window.location.search.indexOf('&spid') > 0) {
                return "AddVideos.aspx" + window.location.search.substring(0, window.location.search.indexOf('&spid'));
            }
            if (window.location.search.indexOf('&vid') > 0) {
                return "AddVideos.aspx" + window.location.search.substring(0, window.location.search.indexOf('&vid'));
            }
            if (window.location.search.indexOf('&bcvid') > 0) {
                return "AddVideos.aspx" + window.location.search.substring(0, window.location.search.indexOf('&bcvid'));
            }
            return base;
        };

        /*************************************************************/
        /*SP Upload Functions*/
        /*************************************************************/
        var GetImageFileBuffer = function (prependText, elementId) {
            var file = $(elementId)[0].files[0];
            var fileName = prependText + file.name;
            var dfd = $.Deferred();
            var reader = new FileReader();

            reader.onloadend = function (e) {
                var result = { 'filename': fileName, 'content': e.target.result };
                dfd.resolve(result);
            }
            reader.onerror = function (e) {
                dfd.reject(e.target.error);
            }

            reader.readAsArrayBuffer(file);
            return dfd;
        };
        var UploadSPDocument = function (filename, content) {
            var appweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPAppWebUrl'));
            var hostweburl = decodeURIComponent(BrightCove.BCApp.Utilities.GetQueryStringParameter('SPHostUrl'));

            var restSource = appweburl +
                "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('"
                + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary
                + "')/rootfolder/files/add(url='" + filename + "',overwrite=true)?@target='" + hostweburl + "'";
            var dfd = $.Deferred();

            $.ajax(
               {
                   'url': restSource,
                   'method': 'POST',
                   'data': content,
                   processData: false,
                   'headers': {
                       'accept': 'application/json;odata=verbose',
                       'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                       "content-length": content.byteLength
                   },
                   'success': function (data) {
                       var d = data;
                       dfd.resolve(d);
                       //alert(d.toString());
                   },
                   'error': function (err) {
                       dfd.reject(err);
                   }
               }
              );

            return dfd;
        };

        /*************************************************************/
        /*Brightcove Functions*/
        /*************************************************************/
        function BrightcoveUpload(callBackFunction) {
            var json = $('#JSONRPC');
            var jview = $('#JSONView');

            var jval = '';
            var guid = me.VideoData().SPID();
            var vid = (me.VideoData().VideoID != undefined) ? me.VideoData().VideoID() : 0;
            var refId = (me.VideoData().ReferenceID != undefined) ? me.VideoData().ReferenceID() : 0;

            if (guid == null || guid.length < 1) {
                alert(BrightCove.BCApp.Messaging.GuidNotPresent());
                return false;
            }

            var tags = me.VideoData().Keywords();
            var token = $('#ddlSelectAccount > option:selected').val();
            var readToken = me.GetReadToken(me.CurrentAccount());

            //Construct the JSON request: 
            if (vid != null && vid != undefined && vid > 0) {
                //change the 'name of the element
                jview.attr('name', 'json').attr('id', 'json');
                $('#create_video').attr('enctype', '');
                
                //Get the correct video id from BC (if it exists)                
                BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByTagID(
                    me.VideoData().SPID(), readToken, function (bcVideoObj) {
                        if (bcVideoObj == null || bcVideoObj.ReferenceID == null) {
                            alert('The selected video item has not been found in the Brightcove Video Cloud: '
                                + me.VideoData().SPID()
                                + '\nThe SharePoint video details will not be updated.'
                                + ' \nPlease see a system administrator to resolve this.');
                            return;
                        }

                        //If video doesn't exist, inform the user and exit out of the operation
                        me.VideoData().ReferenceID(bcVideoObj.ReferenceID);

                        //Format the json string
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdateVideo(
                            me.VideoData().VideoTitle(),
                            bcVideoObj.ReferenceID,
                            me.VideoData().SPID(),
                            tags,
                            me.VideoData().VideoShortDescription(),
                            me.VideoData().VideoLongDescription(),
                            me.VideoData().RelatedLink(),
                            me.VideoData().RelatedLinkText(),
                            me.VideoData().Active(),
                            me.VideoData().Economics(),
                            me.VideoData().VideoStartDate(),
                            me.VideoData().VideoEndDate(),
                            token);

                        jview.val(jval);
                        json.remove();

                        $('#create_video').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
                        $('#create_video').submit();

                        if (callBackFunction != null)
                            callBackFunction();
                    }, null);

            }
            else if (refId > 0) {
                //change the 'name of the element
                jview.attr('name', 'json').attr('id', 'json');
                $('#create_video').attr('enctype', '');

                //Format the json string
                jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdateVideo(
                    me.VideoData().VideoTitle(),
                    refId,
                    me.VideoData().SPID(),
                    tags,
                    me.VideoData().VideoShortDescription(),
                    me.VideoData().VideoLongDescription(),
                    me.VideoData().RelatedLink(),
                    me.VideoData().RelatedLinkText(),
                    me.VideoData().Active(),
                    me.VideoData().Economics(),
                    me.VideoData().VideoStartDate(),
                    me.VideoData().VideoEndDate(),
                    token);

                jview.val(jval);
                json.remove();

                $('#create_video').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
                $('#create_video').submit();

                if (callBackFunction != null)
                    callBackFunction();
            }
            else {
                //Format the json string
                var startDate = new Date(BrightCove.BCApp.Utilities.ReplaceAll(me.VideoData().VideoStartDate(), '-', '/'))
                var endDate = new Date(BrightCove.BCApp.Utilities.ReplaceAll(me.VideoData().VideoEndDate(), '-', '/'))

                jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreateVideo(
                    me.VideoData().VideoTitle(),
                    me.VideoData().SPID(),
                    tags, me.VideoData().VideoShortDescription(),
                    me.VideoData().VideoLongDescription(),
                    me.VideoData().RelatedLink(),
                    me.VideoData().RelatedLinkText(),
                    me.VideoData().Active(),
                    me.VideoData().Economics(),
                    startDate,
                    endDate,
                    token);

                jview.val(jval);
                json.val(jval);

                $('#create_video').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
                $('#create_video').submit();

                if (callBackFunction != null)
                    callBackFunction();
            }

            //Remove the write token value, and replace with the read token
            //token = me.GetReadToken(me.CurrentAccount());
            var keepLooping = true;
            var item = '';
            
            //setTimeout(function () {
            //    alert('searching for newly uploaded video');
            //    BrightCove.BCApp.SharePoint.BrightCoveUtilities.GetBCVideosByTagID(me.VideoData().SPID(), token,
            //        function (returnStatus, newData) {
            //            alert(returnStatus);
            //            keepLooping = false;
            //        });
            //}, 7000);

            //do {
            //    item = BrightCove.BCApp.SharePoint.BrightCoveUtilities.GetBCVideosByTagID(me.VideoData().SPID(), token,
            //        function (returnStatus, newData) {
            //            alert(returnStatus);
            //            keepLooping = false;
            //        });
            //    //alert('looping');
            //} while (keepLooping);
            
            //alert('Video upload done');
        }

        /*************************************************************/
        /*Data Binding Functions*/
        /*************************************************************/
        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(SPContext.UserId(),
            BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

        ko.mapping.fromJSON(returnData, {}, me);

        /*************************************************************/
        /*Security Functions*/
        /*************************************************************/
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        var validatedAccounts = me.AccountListData();
        $(validatedAccounts).each(function (ind, item) {
            //alert(item.AccountViewersGroupName());
            try {
                if (item != null && item.AccountAuthorsGroupName != undefined
                    && item.AccountViewersGroupName() != '') {
                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountViewersGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountAuthorsGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                //validatedAccounts.push(item);
                                me.DeleteItem(item.PropertyId());
                            }
                        });

                            }
                        });
                }
            }
            catch (err) {
                me.DeleteItem(item.PropertyId());
            }
        });
    },
    ManageVideosViewModel: function () {
        var me = this;

        /*************************************************************/
        /*View Model Observables*/
        /*************************************************************/
        me.AccountListData = ko.observableArray([]);
        me.CurrentAccount = ko.observable(BrightCove.BCApp.DataStructures.AccountData);
        me.VideoListData = ko.observableArray([]);
        me.FullVideoListData = ko.observableArray([]);
        me.CloudListData = ko.observableArray([]);

        //me.SPSearchVideoListData = ko.observableArray([]);

        /*************************************************************/
        /*Behaviour Functions*/
        /*************************************************************/
        var DoesItemContainTerms = function (searchTerm, item) {
            var terms = searchTerm.toLowerCase().split(' ');
            //alert('entered search loop');
            if (terms.length > 0) {
                for (var i = 0; i < terms.length; i++) {
                    if (item.VideoTitle().toLowerCase().indexOf(terms[i]) > -1
                        || item.VideoShortDescription().toLowerCase().indexOf(terms[i]) > -1) {
                        //alert('term found!');
                        return true;
                    }
                }
            }
            return false;
        };
        //Returns an observable item from the array
        me.GetAccountItem = function (itemid) {
            if (itemid.length < 1)
                return item;

            var match = ko.utils.arrayFirst(me.AccountListData(), function (item) {
                return item.PropertyId() === itemid;
            });

            if (match) {
                var cloneObj = ko.mapping.fromJS(ko.mapping.toJS(match));
                me.CurrentAccount(cloneObj);
                return match;
            }
            return null;
        };
        //Filters SharePoint videos based on the current selected account
        me.FilterVideosByCurrentAccount = function (searchTerm) {
            var filteredItems = ko.utils.arrayFilter(me.FullVideoListData(), function (item) {
                if(searchTerm != null && searchTerm.length > 0)
                    return item.Account() == me.CurrentAccount().PropertyName()
                           && DoesItemContainTerms(searchTerm, item);
                else {
                    return item.Account() == me.CurrentAccount().PropertyName();
                }
            });
            me.VideoListData(filteredItems);
        };
        me.FormatURL = function (param, param2) {
            if ($('.leftNav a[href^="AddVideos.aspx"]').length > 0) {
                var base = $('.leftNav a[href^="AddVideos.aspx"]').attr('href');
                return base + '&vid=' + param2 + '&account=' + me.CurrentAccount().PropertyId();
            }
            else
            {
                return "javascript:alert('You are not authorized to Edit Video information.  Please contact your system administrator.');";
            }
        };
        me.FormatURLForCloud = function (param) {
            if ($('.leftNav a[href^="AddVideos.aspx"]').length > 0) {
                var base = $('.leftNav a[href^="AddVideos.aspx"]').attr('href');
                return base + '&bcvid=' + param + '&account=' + me.CurrentAccount().PropertyId();
            }
            else {
                return "javascript:alert('You are not authorized to Edit Video information.  Please contact your system administrator.');";
            }
        };
        me.GetTagsArray = function (param) {
            return BrightCove.BCApp.Utilities.GetCommaSeparatedArray(param);
        };
        me.GetReadToken = function (account) {
            return BrightCove.BCApp.Utilities.ReadAccountToken(account);
        };

        /*************************************************************/
        /*Account UI Functions*/
        /*************************************************************/
        me.AccountChange = function (ViewData, Event) {
            var element = $(Event.currentTarget).find('option:selected').data('item-id');
            me.CurrentAccount(BrightCove.BCApp.Utilities.GetAccountByID(element, me.AccountListData()));

            $('#searchButton').trigger('click');

            //me.FilterVideosByCurrentAccount();
            $('#searchBox').val('');
            //$('.AllSharepointResults').show();
            //$('.SharepointResults').hide();
            //$('.CloudResults').hide();
        };
        //Main JS function that executes the app's search function
        me.SearchBtnClick = function (ViewData, Event) {
            $('div.results ul.resultItems > li').remove();
            me.VideoListData([]);
            me.CloudListData([]);

            if (me.CurrentAccount().ReadTokens == undefined)
                return true;
            
            var searchScope = $('.searchScope input:checked').val();
            var searchText = $('#searchBox').val();

            //If the current selection is that of VideoCloud, get the videos from the cloud, then bind them
            //If the selection is that of SharePoint, 
            if (searchScope == 'VideoCloud') {
                $('.AllSharepointResults').hide();
                $('.CloudResults').show();

                var readToken = BrightCove.BCApp.Utilities.ReadAccountToken(me.CurrentAccount());
                if (readToken == null || readToken.length < 1) {
                    return;
                }

                var splitTerms = searchText.split(' ');

                if (splitTerms != null && splitTerms.length > 0) {
                    $(splitTerms).each(function (index, val) {
                        splitTerms[index] = val; //+ "*";
                    });
                    searchText = splitTerms.join('&any=');
                }

                var url = '';

                if (searchText != '' && searchText.length > 1) {
                    url = "https://api.brightcove.com/services/library?command=search_videos"
                        + "&any=" + searchText
                        + "&page_size=45&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2Ctags%2CcreationDate%2ClinkURL%2ClinkText%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2Cthumbnail%2CreferenceId%2Ceconomics%2CitemState"
                        + "&media_delivery=default&sort_by=DISPLAY_NAME%3AASC&page_number=0&get_item_count=true"
                        + "&token=" + readToken;
                }
                else {
                    url = "https://api.brightcove.com/services/library?command=search_videos"
                            + "&none=private&page_size=45&video_fields=thumbnailURL%2Cid%2Cname%2CshortDescription%2Ctags%2CcreationDate%2CstartDate%2CendDate"
                            + "&sort_by=DISPLAY_NAME%3AASC&page_number=0&get_item_count=true"
                            + "&token=" + readToken;
                }

                $.ajax({
                    type: 'GET',
                    url: url,
                    async: false,
                    cache: false,
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success: function (json) {
                        if (json != null && json.items != null) {
                            var cloudVids = [];

                            me.CloudListData(null);

                            $(json.items).each(function (index, item) {
                                if (item.tags != null && item.tags.length > 0) {
                                    var addItemToOutput = true;

                                    $(item.tags).each(function (index, titem) {
                                        //if the video is a BC video, do not display this in the final output
                                        if (titem.indexOf('csp-') > 0) {
                                            addItemToOutput = false;
                                        }
                                    });

                                    if (addItemToOutput) {
                                        var newData = new BrightCove.BCApp.DataStructures.VideoData();

                                        newData.VideoTitle = item.name;
                                        newData.VideoID = item.id;
                                        newData.VideoThumbNail = item.thumbnailURL;
                                        newData.VideoShortDescription = item.shortDescription;
                                        newData.VideoStartDate = item.creationDate;
                                        newData.VideoEndDate = item.endDate;
                                        newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';
                                        cloudVids.push(newData);
                                    }
                                }
                            });

                            var json = ko.mapping.toJS(cloudVids);
                            me.CloudListData(ko.mapping.fromJS(json)());

                            me.SortByFieldClick();
                            //$('div.PaginatedResults').html($('div.CloudResults').html());

                            $(".CloudResults ul").quickPagination({
                                pagerLocation: "both", pageSize: "5"
                            });

                            $('.CloudResults .simplePagerNav').addClass('pagination');
                            $('.PaginatedResults').hide().html('');
                        }
                        else {
                            //alert('');
                            alert('The requested video was not found. Please upload a new Brightcove video to associate with this SharePoint item.');
                        }
                    },
                    error: function (e) {
                        alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                            + e.toString());
                    }
                });
            }
            else {

                if (searchText != null && searchText.length > 0) {
                    me.FilterVideosByCurrentAccount(searchText);
                }
                else {
                    me.FilterVideosByCurrentAccount();
                }

                me.SortByFieldClick();
                $('div.PaginatedResults').html($('div.AllSharepointResults').html());

                $.when(
                    $(".PaginatedResults ul.resultItems").quickPagination({
                        pagerLocation: "both", pageSize: "5"
                    })
                ).then(
                    $('.PaginatedResults .simplePagerNav').addClass('pagination')
                );

                //$('div.PaginatedResults').show();
                //$('div.AllSharepointResults').hide();
                $('div.PaginatedResults').show();
                $('div.AllSharepointResults').hide();
                $('div.CloudResults').hide();
            }
        };
        me.SortByFieldClick = function (ViewData, Event) {
            if (Event != null) {
                $('#searchButton').click();
                return true;
            }
            //alert('youre fired');
            var orderField = $('.searchResultsOrderByField input:checked').val();
            var orderDirection = $('.searchSortOrder input:checked').val();
            var startPath = '';
            var searchScope = $('.searchScope input:checked').val();
            var searchText = $('#searchBox').val();

            if (searchText.length > 0) {
                if (searchScope == 'SharePoint') {
                    startPath = '.AllSharepointResults ';
                }
                else {
                    startPath = '.CloudResults ';
                }
            }
            else {
                if (searchScope == 'SharePoint') {
                    startPath = '.AllSharepointResults ';
                }
                else {
                    startPath = '.CloudResults ';
                }
            }

            switch (orderField) {
                case 'relevance':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByOrderAscending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByOrderDescending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    break;
                case 'displayName':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByNameAscending)
                            .appendTo(startPath + ' ul.resultItems');

                        var sorted = me.VideoListData().sort(function (a, b) {
                            return (a.VideoTitle()) > (b.VideoTitle()) ? 1 : -1;
                        });

                        me.VideoListData(sorted);
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByNameDescending)
                            .appendTo(startPath + ' ul.resultItems');

                        var sorted = me.VideoListData().sort(function (a, b) {
                            return (a.VideoTitle()) < (b.VideoTitle()) ? 1 : -1;
                        });

                        me.VideoListData(sorted);
                    }
                    break;
                case 'creationDate':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateCreatedAscending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateCreatedDescending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    break;
                case 'startDate':
                    if (orderDirection == 'ascending') {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateStartedAscending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    else {
                        $(startPath + " ul.resultItems > li").sort(BrightCove.BCApp.Utilities.SortByDateStartedDescending)
                            .appendTo(startPath + ' ul.resultItems');
                    }
                    break;
            }
            return true;
            //element.attr('checked', 'checked');
        };
        me.SearchScopeClick = function (ViewData, Event) {
            $('#searchButton').trigger('click');
            return true;
        };
        
        /*************************************************************/
        /*Data Binding Functions*/
        /*************************************************************/
        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(null, true);
        ko.mapping.fromJSON(returnData, {}, me);

        var videoData = BrightCove.BCApp.SharePoint.ListUtilities.GetVideos();
        me.FullVideoListData(ko.mapping.fromJS(videoData)());

        /*************************************************************/
        /*Security Functions*/
        /*************************************************************/
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        var validatedAccounts = me.AccountListData();
        $(validatedAccounts).each(function (ind, item) {
            //alert(item.AccountViewersGroupName());
            try {
                if (item != null && item.AccountAuthorsGroupName != undefined
                    && item.AccountViewersGroupName() != '') {
                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountViewersGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountAuthorsGroupName(),
                            function (UserBelongsToGroup) {
                                    if (!UserBelongsToGroup) {
                                        //validatedAccounts.push(item);
                                        me.DeleteItem(item.PropertyId());
                                         }
                                    });
                                
                            }
                        });
                }
            }
            catch (err) {
                me.DeleteItem(item.PropertyId());
            }
        });
    },
    ManagePlaylistsViewModel: function () {
        var me = this;
        me.AccountListData = ko.observableArray([]);
        me.PlayListData = ko.observableArray([]);
        me.CurrentPlayListData = ko.observableArray([]);

        me.VideoListData = ko.observableArray([]);
        me.AllSPVideos = ko.observableArray([]);
        me.FilteredSPVideos = ko.observableArray([]);
        me.SelectedVideosFromFilter = ko.observableArray([]);
        me.SmartPlaylistVideos = ko.observableArray([]);
        me.CloudListData = ko.observableArray([]);
        
        me.SortType = ko.observable('desc');

        me.GetPlaylistType = function (param) {
            if (param == null || param == '' || param == 'EXPLICIT') {
                return 'Manual Playlist';
            }
            else {
                return 'Smart Playlist';
            }
        };
        me.GetPlaylistTypeForSort = function (param) {
            if (param == null || param == '' || param == 'EXPLICIT') {
                return 'manual';
            }
            else {
                return 'smart';
            }
        };
        me.ShortenIDList = function (param) {
            var idlist = param.split(',');

            if (idlist != null && idlist.length > 4) {
                var trimmedlist = [];
                trimmedlist = idlist.splice(0, 4);
                param = trimmedlist.join(',');
                param += '...';
            }

            return param;
        };
        me.GetVideoItem = function (itemid) {
            if (itemid.length < 1)
                return item;

            var match = ko.utils.arrayFirst(me.AllSPVideos(), function (item) {
                return item.VideoID() === itemid;
            });

            return match;
        };
        me.EditPlaylist = function (ViewData, Event) {
            $('.newPlaylistModal').modal('show');
            modalEditMode();
        };
        me.GetReadToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('ead-') > -1) {
                        var tok = tokens[i].split('ead-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.GetWriteToken = function (param) {
            //Get the corresponding write tokens for each of the accounts listed in the dropdown
            var tokens = param.ReadTokens();
            if (tokens != null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].toLowerCase().indexOf('rite-') > -1) {
                        var tok = tokens[i].split('rite-');
                        return tok[1];
                    }
                }
            }
            return '';
        };
        me.AddClickEventsToPage = function () {
            $('#tblPlaylists .name---').click(function () {
                //alert('test test test');

                var vids = $(this).data('vids');
                var elem = $(this);

                BrightCove.BCApp.SharePoint.ListUtilities.GetBCVideosByID(vids,
                    function (elem) {
                        me.VideoListData(ko.mapping.fromJS(SPContext.DataStore2)());

                        $('#txtName').val(elem.text());
                        $('.pid').text(elem.data('pid'));
                        $('.accountLabel').text($('#ddlSelectAccount > option:selected').text());
                        $('.newPlaylistModal').modal('show');
                        modalEditMode();

                        $('.manualListControl .availableVideos .video').unbind().click(function () {
                            $(this).toggleClass('selected');
                        });

                        $('#btnRight').click(function () {
                            $('.manualListControl .availableVideos .video.selected').remove().appendTo('.newPlaylist');
                            $('.newPlaylist .video').removeClass('selected');
                            newPlaylistClick();
                            return false;
                        });

                        $('#btnLeft').click(function () {
                            $('.newPlaylist .video.selected').remove().appendTo('.manualListControl .availableVideos');
                            $('.manualListControl .availableVideos .video').removeClass('selected');
                            availableVideosClick();
                            return false;
                        });
                    }, elem);
            });
            
        };
        me.SavePlaylist = function () {
            var plname = $('#txtName').val();
            var playlistType = $('#ddlNewType > option:selected').text();
            
            if (plname == '')
            {
                alert('Please enter a playlist name');
                return;
            }

            if (playlistType == 'Smart' && $('#smartTags').val() == '') {
                alert('Please enter the tag values that are needed');
                return;
            }

            BrightcoveUpload('addEdit', function () {
                alert('The submitted playlist data will be available in a few minutes after '
                        + '\nBrightcove has processed the information.');

                $('.newPlaylistModal').modal('hide');
                $('#txtName').val('');
                $('#txtDescription').val('');
                //BrightCove.BCApp.Utilities.PageRefresh();
            });

        };
        me.DeletePlaylist = function () {
            var plname = $('#txtName').val();

            if (me.CurrentPlayListData() == null) {
                alert('Please select a playlist from the list area.');
                return;
            }
            BrightcoveUpload('delete', function () {
                alert('The submitted playlist data will be deleted in a few minutes after '
                        + '\nBrightcove has processed the information.');

                $('.newPlaylistModal').modal('hide');
                //BrightCove.BCApp.Utilities.PageRefresh();
            });

        };
        me.AccountChanged = function () {
            alert('test');
        };
        me.PreviewSmartlist = function () {
            var searchText = $('#smartTags').val();
            var splitTerms = searchText.split(' ');
            var conditionalOperator = $('#uxSmartPlaylistContains > option:selected').val().toLowerCase();
            var pageSize = $('#smartPageSize').val();
            var readToken = $('#ddlSelectAccount > option:selected').val();

            if (pageSize.length < 1) {
                pageSize = 5;
            }

            if (conditionalOperator == 'and'){
                conditionalOperator = 'all';
            }
            else {
                conditionalOperator = 'any';
            }

            if (splitTerms != null && splitTerms.length > 0) {
                $(splitTerms).each(function (index, val) {
                    splitTerms[index] = val;
                });
                searchText = splitTerms.join('&' + conditionalOperator + '=tag:');
            }
            searchText = '&' + conditionalOperator + '=tag:' + searchText;

            var url = '';
            url = "https://api.brightcove.com/services/library?command=search_videos"
                        + searchText
                        + "&none=private"
                        + "&page_size=" + pageSize
                        + "&video_fields=thumbnailURL%2Cid%2Cname%2CshortDescription%2Ctags%2CcreationDate%2CstartDate%2CendDate"
                        + "&sort_by=DISPLAY_NAME%3AASC&page_number=0&get_item_count=true"
                        + "&token=" + readToken;

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    if (json != null && json.items != null) {
                        var vids = [];

                        $(json.items).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            newData.VideoTitle = item.name;
                            newData.VideoID = item.id;
                            newData.VideoThumbNail = item.thumbnailURL;
                            newData.VideoShortDescription = item.shortDescription;
                            newData.VideoStartDate = item.creationDate;
                            newData.VideoEndDate = item.endDate;
                            newData.Keywords = (item.tags != null && item.tags.length > 0) ? item.tags.join(',') : '';

                            vids.push(newData);
                        });

                        var json = ko.mapping.toJS(vids);
                        me.SmartPlaylistVideos(ko.mapping.fromJS(json)());

                    }
                    else {
                        //alert('');
                        alert('The requested video was not found. Please upload a new Brightcove video to associate with this SharePoint item.');
                    }
                },
                error: function (e) {
                    alert('Error retrieving video from Brightcove...cannot proceed with video update. '
                        + e.toString());
                }
            });
        };
        me.LoadPlaylistEditor = function (refElem) {
            //Clear the existing fields
            $('#txtName').val('');
            $('#txtDescription').val('');
            $('#smartPageSize').val('5');
            //$('#txtDescription').val('');

            //Load the fields with the object values
            var selectedVal = $('#ddlSelectAccount > option:selected').val();

            if (selectedVal == '') {
                alert('An account must be selected before proceeding.');
                return;
            }
            
            $('.newPlaylist').html();
            $('.accountLabel').text($('#ddlSelectAccount > option:selected').text());
            FilterVideosByCurrentAccount();
            $('.newPlaylistModal').modal('show');

            if (refElem != null && refElem.data != undefined) {
                var pid = refElem.data('pid');
                var currentPL = BrightCove.BCApp.Utilities.GetPlaylistByID(pid, me.PlayListData());
                me.CurrentPlayListData(currentPL);
                $('#myModalLabel > span').html('Edit Playlist');
                $('#txtName').val(refElem.data('name'));
                modalEditMode();

                var playlistType = me.CurrentPlayListData().PlaylistType();

                if (playlistType == 'EXPLICIT') {
                    $('#ddlNewType').val('Manual');
                    $('#ddlNewType').change();

                    var selectedVids = me.CurrentPlayListData().VideoIDs().split(',');
                    var selectedHtml = '';

                    $(selectedVids).each(function (ind, item) {
                        //alert('div[data-videoid="' + item + '"]');
                        var vidItem = $('.manualListControl .availableVideos div.video[data-referenceid="' + item + '"]');
                        if (vidItem != null && vidItem.length > 0) {
                            selectedHtml += vidItem[0].outerHTML;
                            vidItem.remove();
                        }
                    });
                    $('.newPlaylist').html(selectedHtml);

                    $('.manualListControl .newPlaylist .video').unbind().click(function () {
                        if ($('#cbxMove').is(':checked')) {
                            $('.newPlaylist .video').removeClass('selected');
                            $(this).addClass('selected');
                        }
                        else {
                            $(this).toggleClass('selected');
                        }
                    });
                }
                else {
                    $('#ddlNewType').val('Smart');
                    $('#ddlNewType').change();
                    $('#smartTags').val(me.CurrentPlayListData().Tags());
                    $('#smartSortOder').val(playlistType);
                }

            }
            else {
                $('.modal-title > span').html('Add New Playlist');
                me.CurrentPlayListData(null);
                modalNewMode();
            }

            //UI Behaviour
            $('.manualListControl .availableVideos .video').unbind().click(function () {
                $(this).toggleClass('selected');
            });

            $('#btnRight').click(function () {
                $('.manualListControl .availableVideos .video.selected').remove().appendTo('.newPlaylist');
                $('.newPlaylist .video').removeClass('selected');
                newPlaylistClick();
                return false;
            });

            $('#btnLeft').click(function () {
                $('.newPlaylist .video.selected').remove().appendTo('.manualListControl .availableVideos');
                $('.manualListControl .availableVideos .video').removeClass('selected');
                availableVideosClick();
                return false;
            });
        };
        me.SortList = function (ViewData, Event) {
            
            var element = $(Event.currentTarget);
            var fieldType = element.data('sf');
            function CopyLists() {
                $('#sorted').html($('#databound').html());
                $('#databound').hide();
                $('#sorted').show();
                $('#sorted .playlistItems').click(function () {
                    me.LoadPlaylistEditor($(this));
                });
            }
            
            switch (fieldType) {
                case 'name':
                    CopyLists();
                    if(me.SortType() == 'asc'){
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByNameAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByNameDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
                case 'desc':
                    CopyLists();
                    if (me.SortType() == 'asc') {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByDescAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByDescDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
                case 'type':
                    CopyLists();
                    if (me.SortType() == 'asc') {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByTypeAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByTypeDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
                case 'id':
                    CopyLists();
                    if (me.SortType() == 'asc') {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByIDAscending)
                            .appendTo("#sorted");
                        me.SortType('desc');
                    } else {
                        $("#sorted > tr").sort(BrightCove.BCApp.Utilities.PL_SortByIDDescending)
                            .appendTo("#sorted");
                        me.SortType('asc');
                    }
                    break;
            }
        };
        var FilterVideosByCurrentAccount = function () {
            var fullVideoItemsData = ko.mapping.fromJS(ko.mapping.toJS(me.AllSPVideos()));
            //me.FullVideoListData(fullVideoItemsData);
            var filter = $('#ddlSelectAccount > option:selected').text();

            var filteredItems = ko.utils.arrayFilter(fullVideoItemsData(), function (item) {
                return item.Account() == filter;
            });
            me.FilteredSPVideos(filteredItems);

            function DeleteVideoItem(itemid) {
                if (itemid == null || itemid.length < 1)
                    return false;
                me.FilteredSPVideos.remove(function (item) {
                    return item.VideoID() == itemid;
                });
            };
            
            var filterVidsCopy = me.FilteredSPVideos();
            $(filterVidsCopy).each(function (ind, item) {
                if (item.ReferenceID() == null
                    || item.ReferenceID() == undefined
                    || item.ReferenceID().length < 1) {

                    DeleteVideoItem(item.VideoID());
                }
            });
        };
        $('#ddlSelectAccount').change(function () {
            $('#databound').show();
            $('#sorted').html('').hide();
                var readToken = $(this).find('option:selected').val();
                BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCPlaylists(function (results) {
                //Get the videos for the selected account
                playListData = results;
                me.PlayListData(null);

                //to be removed 
                var vData = BrightCove.BCApp.SharePoint.ListUtilities.GetPlaylistSPVideos(function () {
                }, readToken);
                    
                me.PlayListData(ko.mapping.fromJS(playListData)());
                me.AllSPVideos(ko.mapping.fromJS(vData)());

                var allVidsCopy = me.AllSPVideos();
                $(allVidsCopy).each(function (ind, item) {
                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByTagID(
                        item.SPID(), readToken,
                        function (bcVideoObj) {
                            if (bcVideoObj == null || bcVideoObj.ReferenceID == null) {
                                return;
                            }
                            var cItem = me.GetVideoItem(item.VideoID());
                            cItem.ReferenceID(bcVideoObj.ReferenceID);
                        });
                });

                $('.playlistItems').click(function () {
                    me.LoadPlaylistEditor($(this));
                });
            }, readToken);
            //alert('value is: ' + );
        });
        /*************************************************************/
        /*Brightcove Functions*/
        /*************************************************************/
        function BrightcoveUpload(mode, callBackFunction) {
            var jview = $('#JSONView');
            var plname = $('#txtName').val();
            var pldescription = $('#txtDescription').val();

            jview.attr('name', 'json').attr('id', 'json');
            $('#create_playlist').attr('enctype', '');

            var vidsArr = [];

            $('.newPlaylist .title').each(function () {
                var refId = $(this).data('referenceid');

                if (refId == null || refId == undefined) {
                    refId = $(this).data('videoid');
                }
                else {
                    refId = '"' + refId + '"';
                }

                if (refId != null && refId != undefined && refId.length > 0)
                    vidsArr.push(refId);
            });

            var selectedVids = vidsArr.join(',');
            var selectedToken = $('#ddlSelectAccount > option:selected').data('write-token');

            //var options = "OLDEST_TO_NEWEST" | "NEWEST_TO_OLDEST" | "START_DATE_OLDEST_TO_NEWEST"
            //    | "START_DATE_NEWEST_TO_OLDEST" | "ALPHABETICAL" | "PLAYS_TOTAL" | "PLAYS_TRAILING_WEEK";
            var playlistType = $('#ddlNewType > option:selected').text();
            var smartTags = $('#smartTags').val();
            var smartPLCondition = $('#uxSmartPlaylistContains > option:selected').val();
            var smartSortOder = $('#smartSortOder > option:selected').val();
            var totalVideos = $('#smartPageSize').val();

            var jval = '';

            if (mode == 'addEdit') {
                if (me.CurrentPlayListData() == null) {
                    if (playlistType == 'Manual') {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreatePlaylist(plname,
                            selectedVids, pldescription, selectedToken);
                    }
                    else {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.CreateSmartPlaylist(plname,
                            pldescription, smartTags,
                            smartPLCondition, smartSortOder, totalVideos, selectedToken);
                    }
                }
                else {
                    if (playlistType == 'Manual') {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdatePlaylist(plname,
                            me.CurrentPlayListData().ID(), pldescription,
                            selectedVids, selectedToken);
                    }
                    else {
                        jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.UpdateSmartPlaylist(plname,
                            pldescription, me.CurrentPlayListData().ID(), smartTags,
                            smartPLCondition, smartSortOder, totalVideos, selectedToken);
                    }
                }
            }
            else if (mode == 'delete') {
                jval = BrightCove.BCApp.BrightCoveUtilities.JSONUtilities.DeletePlaylist(
                    me.CurrentPlayListData().ID(),
                    selectedToken);
            }

            jview.val(jval);

            $('#create_playlist').attr('action', BrightCove.BCApp.Constants.BrightCoveURLConstants.PostURL);
            $('#create_playlist').submit();

            if (callBackFunction != null)
                callBackFunction();
        }

        /*************************************************************/
        /*UI Functions*/
        /*************************************************************/
        
        var unsetMoveButtons = function () {
            $('#btnUp').unbind().attr('disabled', true);
            $('#btnDown').unbind().attr('disabled', true);
        }
        var modalEditMode = function () {
            //load data
            $('#ddlNewType').change();
            $('.modal-header h4 span').html('Edit Playlist');
            $('.newPlaylistModal .editMode').show();
        }
        var modalNewMode = function () {
            $('.modal-header h4 span').html('Add New Playlist');
            $('.newPlaylistModal .editMode').hide();
        }
        var setMoveButtons = function () {
            $('#btnUp').click(function () {
                var current = $('.newPlaylist .selected');
                current.prev().before(current);
            });
            $('#btnDown').click(function () {
                var current = $('.newPlaylist .selected');
                current.next().after(current);
            });
            $('#btnUp').attr('disabled', false);
            $('#btnDown').attr('disabled', false);
        };

        var returnData = BrightCove.BCApp.SharePoint.ListUtilities.GetAccounts(SPContext.UserId(),
            BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

        ko.mapping.fromJSON(returnData, {}, me);

        var currentAccount = me.AccountListData()[0];

        /*************************************************************/
        /*Security Functions*/
        /*************************************************************/
        me.DeleteItem = function (itemid) {
            if (itemid == null || itemid.length < 1)
                return false;
            me.AccountListData.remove(function (item) {
                return item.PropertyId() == itemid;
            });
        };
        var validatedAccounts = me.AccountListData();
        $(validatedAccounts).each(function (ind, item) {
            //alert(item.AccountViewersGroupName());
            try {
                if (item != null && item.AccountAuthorsGroupName != undefined
                    && item.AccountViewersGroupName() != '') {
                    BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountViewersGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                BrightCove.BCApp.SharePoint.ListUtilities.IsCurrentUserMemberOfGroup(item.AccountAuthorsGroupName(),
                        function (UserBelongsToGroup) {
                            if (!UserBelongsToGroup) {
                                //validatedAccounts.push(item);
                                me.DeleteItem(item.PropertyId());
                            }
                        });

                            }
                        });
                }
            }
            catch (err) {
                me.DeleteItem(item.PropertyId());
            }
        });
    }
};

//**************************************************************************************************
//Data Functions
//**************************************************************************************************    
BrightCove.BCApp.DataStructures = {
    AccountData: function () {
        PropertyName = '';
        PropertyId = '';
        PropertyValue = '';
        AccountAuthorsGroup = '';
        AccountViewersGroup = '';
        AccountAuthorsGroupName = '';
        AccountViewersGroupName = '';
        DefaultVideoPlayerId = '';
        DefaultPlaylistPlayerId = '';
        DefaultPublisherId = '';
        ReadAPIServiceURL = '';
        WriteAPIServiceURL = '';
        ReadTokens = [''];
        WriteTokens = [''];

        return this;
    },
    VideoData: function () {
        VideoTitle = 'New Video Item';
        Account = '';
        SPID = 'BCSP-1';
        VideoID = '';
        VideoThumbNail = '';
        VideoStillImage = '';
        VideoLongDescription = '';
        VideoShortDescription = '';
        RelatedLink = '';
        RelatedLinkText = '';
        ReferenceID = '';
        VideoStartDate = '';
        VideoEndDate = '';
        Keywords = '';
        Economics = '';
        Active = '';

        return this;
    },
    PlaylistData: function () {
        Title = '';
        Thumbnail = '';
        ShortDescription = '';
        PublishDate = '';
        StartDate = '';
        EndDate = '';
        Type = '';
        ID = '';
        ReferenceID = '';
        Keywords = '';
        VideoIDs = '';
        VideoData = [];
        TagInclusionRule = '';
        Tags = '';
        PlaylistType = '';
        return this;
    }
};

BrightCove.BCApp.SharePoint = {
    ListUtilities: {
        //Get Items
        GetListItem: function (ListItemName, CallBackFunction, me) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(ListItemName);

            var camlQuery = new SP.CamlQuery();

            function onGetListSucceeded(sender, args) {
                this.GetADGroups();

                //Get the current working page
                var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();

                //Initialize the menus and breadcrumbs
                BrightCove.BCApp.Menus.Initialize(pageName);

                //Invoke the main page event
                BrightCove.BCApp.Initialize.InitializePageLoadEvent(pageName);
            }

            function onGetVideosListSucceeded(sender, args) {
                SPContext.ViewObject().LoadData();
            }
            function onGetListFailed(sender, args) {
                alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }

            switch (ListItemName) {
                case BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts:
                    camlQuery.set_viewXml(
                        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
                        '<RowLimit>100000</RowLimit></View>'
                    );
                    SPContext.DataStore = oList.getItems(camlQuery);
                    cContext.load(SPContext.DataStore);

                    cContext.executeQueryAsync(
                        Function.createDelegate(this, onGetListSucceeded),
                        Function.createDelegate(this, onGetListFailed)
                    );
                    break;
                case BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList:
                    SPContext.DataStore2 = oList.getItems(camlQuery);
                    cContext.load(SPContext.DataStore2);

                    cContext.executeQueryAsync(
                        Function.createDelegate(this, onGetVideosListSucceeded),
                        Function.createDelegate(this, onGetListFailed)
                    );
                    break;
            }

            if (CallBackFunction != null)
                CallBackFunction(me);
        },
        GetAccounts: function (CallBackFunction, AddEmptyFirstElement) {
            if (SPContext.DataStore.getEnumerator == undefined) {
                location.href = location.href;
                return false;
            }

            //Show the main page content after everything is loaded
            BrightCove.BCApp.Utilities.ShowMainPageContent();

            var SPData = {
                AccountListData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.DataStore.getEnumerator();

            if (AddEmptyFirstElement) {
                var newData = new BrightCove.BCApp.DataStructures.AccountData();
                newData.PropertyName = 'Select an Account';
                newData.PropertyId = '';
                newData.PropertyValue = '';
                newData.AccountAuthorsGroup = '';
                newData.AccountViewersGroup = '';
                newData.AccountAuthorsGroupName = '';
                newData.AccountViewersGroupName = '';
                newData.DefaultVideoPlayerId = '';
                newData.DefaultPlaylistPlayerId = '';
                newData.DefaultPublisherId = '';
                newData.ReadAPIServiceURL = '';
                newData.WriteAPIServiceURL = '';
                newData.ReadTokens = [];
                newData.WriteTokens = [];

                SPData.AccountListData.push(newData);
            }

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                //listItemInfo += '<li>' + '\nTitle: ' + oListItem.get_item('id') + ' ' + oListItem.get_item('Title') + '</li>';

                var newData = new BrightCove.BCApp.DataStructures.AccountData();
                newData.PropertyName = oListItem.get_item('Title');
                newData.PropertyId = oListItem.get_item('ID');
                newData.PropertyValue = oListItem.get_item('PublisherId');
                newData.AccountAuthorsGroup = oListItem.get_item('AuthorsGroupID');
                newData.AccountViewersGroup = oListItem.get_item('ViewersGroupID');
                newData.AccountAuthorsGroupName = oListItem.get_item('AccountAuthorsGroupName');
                newData.AccountViewersGroupName = oListItem.get_item('AccountViewersGroupName');
                newData.DefaultVideoPlayerId = oListItem.get_item('DefaultVideoPlayerId');
                newData.DefaultPlaylistPlayerId = oListItem.get_item('DefaultPlaylistPlayerId');
                newData.DefaultPublisherId = oListItem.get_item('PublisherId');
                newData.ReadAPIServiceURL = oListItem.get_item('ReadAPIServiceURL');
                newData.WriteAPIServiceURL = oListItem.get_item('WriteAPIServiceURL');

                var tokens = oListItem.get_item('Tokens');

                if (tokens != null && tokens.length > 0) {
                    newData.ReadTokens = tokens.split(',');//['111', '111', '111', '111', '111', '111'];
                    newData.WriteTokens = tokens.split(','); //['111b', '111b', '111b'];
                }
                else {
                    newData.ReadTokens = [];
                    newData.WriteTokens = [];
                }
                SPData.AccountListData.push(newData);
            }

            var jsonData = ko.toJSON(SPData);

            if (CallBackFunction != null && typeof (CallBackFunction) == "function")
                CallBackFunction();

            //return SPData.AccountListData;
            return jsonData;
        },

        //Add Items
        AddAccountItem: function (newData) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var oListItem = oList.addItem(itemCreateInfo);

            oListItem.set_item('Title', newData.PropertyName());
            oListItem.set_item('PublisherId', newData.DefaultPublisherId());
            oListItem.set_item('AccountAuthorsGroupName', newData.AccountAuthorsGroupName());
            oListItem.set_item('AccountViewersGroupName', newData.AccountViewersGroupName());
            oListItem.set_item('AuthorsGroupID', newData.AccountAuthorsGroupName());
            oListItem.set_item('ViewersGroupID', newData.AccountViewersGroupName());
            oListItem.set_item('DefaultVideoPlayerId', newData.DefaultVideoPlayerId());
            oListItem.set_item('DefaultPlaylistPlayerId', newData.DefaultPlaylistPlayerId());
            //oListItem.set_item('PublisherId', newData.DefaultPublisherId());
            oListItem.set_item('ReadAPIServiceURL', newData.ReadAPIServiceURL());
            oListItem.set_item('WriteAPIServiceURL', newData.WriteAPIServiceURL());
            oListItem.set_item('Tokens', newData.ReadTokens().join()); //"111,111,111,111,111,111");

            //newData.ReadTokens = ['111', '111', '111', '111', '111', '111'];
            //newData.WriteTokens = ['111b', '111b', '111b'];

            oListItem.update();

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onAddListItem),
                Function.createDelegate(this, this.onAddListItemFailed)
            );
        },
        AddVideoItem: function (videoData, CallBackFunction) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);//SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var oListItem = new Object();
            var vid = (videoData.VideoID != undefined) ? videoData.VideoID() : 0;

            if (vid != null && vid > 0) {
                oListItem = oList.getItemById(vid);
            }
            else {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                oListItem = oList.addItem(itemCreateInfo);
            }

            oListItem.set_item('Title', videoData.VideoTitle());
            oListItem.set_item('ReferenceID', videoData.ReferenceID());
            oListItem.set_item('ShortDescription', videoData.VideoShortDescription());
            oListItem.set_item('LongDescription', videoData.VideoLongDescription());
            if (videoData.VideoStartDate() != '') {
                oListItem.set_item('StartDate', new Date(BrightCove.BCApp.Utilities.ReplaceAll(videoData.VideoStartDate(), '-', '/')));
            }
            if (videoData.VideoEndDate() != '') {
                oListItem.set_item('EndDate', new Date(BrightCove.BCApp.Utilities.ReplaceAll(videoData.VideoEndDate(), '-', '/')));
            }
            oListItem.set_item('Economic', videoData.Economics());
            oListItem.set_item('Account', videoData.Account());
            oListItem.set_item('Active', videoData.Active());
            oListItem.set_item('SPID', videoData.SPID());

            oListItem.set_item('Keywords', videoData.Keywords());

            var urlValue = new SP.FieldUrlValue();
            if (videoData.RelatedLink != null && videoData.RelatedLink != undefined) {
                urlValue.set_url(videoData.RelatedLink());
                urlValue.set_description(videoData.RelatedLinkText());
                oListItem.set_item('RelatedLink', urlValue);
            }

            var thumb = new SP.FieldUrlValue();
            if (videoData.VideoThumbNail != null && videoData.VideoThumbNail != undefined) {
                thumb.set_url(videoData.VideoThumbNail());
                thumb.set_description(videoData.VideoThumbNail());
                oListItem.set_item('VideoThumbnail', thumb);
            }

            var still = new SP.FieldUrlValue();
            if (videoData.VideoStillImage != null && videoData.VideoStillImage != undefined) {
                still.set_url(videoData.VideoStillImage());
                still.set_description(videoData.VideoStillImage());
                oListItem.set_item('VideoImage', still);
            }

            oListItem.update();
            cContext.load(oList);

            function onAddVideoItem() {
                console.log('SharePoint Video Item Updated');
                //alert('new id is: ' + oListItem.get_id());
                if (CallBackFunction != null)
                    CallBackFunction(oListItem);
            }
            function onAddListItemFailed(sender, args) {
                alert('Add failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }

            cContext.executeQueryAsync(
                Function.createDelegate(this, onAddVideoItem),
                Function.createDelegate(this, onAddListItemFailed)
            );
        },

        //Update Items
        UpdateListItem: function (newData) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

            var oListItem = oList.getItemById(newData.PropertyId());
            oListItem.set_item('Title', newData.PropertyName());

            oListItem.set_item('PublisherId', newData.DefaultPublisherId());
            oListItem.set_item('AccountAuthorsGroupName', newData.AccountAuthorsGroupName());
            oListItem.set_item('AccountViewersGroupName', newData.AccountViewersGroupName());
            oListItem.set_item('AuthorsGroupID', newData.AccountAuthorsGroupName());
            oListItem.set_item('ViewersGroupID', newData.AccountViewersGroupName());
            oListItem.set_item('DefaultVideoPlayerId', newData.DefaultVideoPlayerId());
            oListItem.set_item('DefaultPlaylistPlayerId', newData.DefaultPlaylistPlayerId());
            oListItem.set_item('ReadAPIServiceURL', newData.ReadAPIServiceURL());
            oListItem.set_item('WriteAPIServiceURL', newData.WriteAPIServiceURL());
            oListItem.set_item('Tokens', newData.ReadTokens().join()); //"111,111,111,111,111,111");

            oListItem.update();

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onUpdateListItem),
                Function.createDelegate(this, this.onUpdateListItemFailed)
            );
        },

        //Delete Items
        DeleteListItem: function (data) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts);

            var oListItem = oList.getItemById(data.PropertyId());
            oListItem.deleteObject();

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onDeleteSucceeded),
                Function.createDelegate(this, this.onDeleteFailed)
            );
        },

        //to be removed        
        GetBCVideosByID: function (VideoIDs, CallBackFunction, refElem) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_ids"
                    + "&video_ids=" + VideoIDs.replace(',', '%2C') //"2790007957001%2C1964441415001"
                    + "&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2CcreationDate%2CpublishedDate%2ClinkURL%2ClinkText%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2Cthumbnail%2CreferenceId%2Ceconomics%2CaccountId%2CitemState%2CstartDate%2CendDate&media_delivery=default"
                    + "&token=OSpK6k_-o4xQjnZCaMffnTCKSFzU4yUqwNvYrCk2K43PjG3e5EReLA..";

            var modalEditMode = function () {
                //load data
                $('#ddlNewType').change();
                $('.modal-header h4 span').html('Edit Playlist');
                $('.newPlaylistModal .editMode').show();
            }
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    if (json != null && json.items != null) {

                        $(json.items).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.PlaylistData();

                            newData.VideoTitle = item.name;
                            newData.VideoThumbNail = item.thumbnailURL;
                            newData.VideoShortDescription = item.shortDescription;
                            newData.VideoStartDate = item.creationDate;
                            newData.VideoEndDate = item.endDate;
                            newData.ReferenceID = item.referenceId;
                            newData.VideoID = item.id;

                            SPData.VideoListData.push(newData);
                        });
                        SPContext.DataStore2 = SPData.VideoListData;

                        if (CallBackFunction != null && CallBackFunction != undefined)
                            CallBackFunction(refElem);
                    }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                }
            });
        },

        //to be renamed
        GetPlaylistSPVideos: function (CallBackFunction, token) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.VideosList.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();

                var newData = new BrightCove.BCApp.DataStructures.VideoData();
                
                $.when(
                    BrightCove.BCApp.BrightCoveUtilities.VideoDAL.GetBCVideosByTagID(oListItem.get_item('SPID'), token)
                ).done(function (param) {
                    var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);
                    SPData.VideoData.push(newData);
                });
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData);
            return jsonData;
        },
        GetVideos: function (CallBackFunction) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.DataStore2.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);

                SPData.VideoData.push(newData);
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData); 
            return jsonData;
        },

        //to be removed
        GetVideosForPlaylist: function (CallBackFunction) {
            var SPData = {
                VideoData: []
            };

            var listItemInfo = '';
            var listItemEnumerator = SPContext.VideosList.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);

                SPData.VideoData.push(newData);
            }

            var jsonData = ko.mapping.toJS(SPData.VideoData); 
            return jsonData;
        },
        GetVideoById: function (ListItemId, CallBackFunction) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var oListItem = oList.getItemById(ListItemId);
            var camlQuery = new SP.CamlQuery();

            camlQuery.set_viewXml(
                        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
                        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
                        '<RowLimit>100000</RowLimit></View>'
                    );

            SPContext.DataStore2 = oList.getItems(camlQuery);
            cContext.load(SPContext.DataStore2);

            cContext.executeQueryAsync(
                Function.createDelegate(this, this.onGetVideoByIdSucceeded),
                Function.createDelegate(this, this.onGetListFailed)
            );
        },
        GetSPVideos: function (CallBackFunction, param) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();
            var oList = parentWeb.get_lists().getByTitle(
                BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList);

            var camlQuery = new SP.CamlQuery();

            SPContext.VideosList = oList.getItems(camlQuery);
            cContext.load(SPContext.VideosList);

            var succeeded = function (sender, args) {
                if (CallBackFunction != null) {
                    CallBackFunction(param);
                }
            };
            var failed = function (sender, args) {
                alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            };

            cContext.executeQueryAsync(
                Function.createDelegate(this, succeeded),
                Function.createDelegate(this, failed)
            );
        },
        GetADGroups: function (CallBackFunction) {
            var cContext = SP.ClientContext.get_current();
            var clientContext = new SP.AppContextSite(cContext, SPContext.ContextURLPath);
            var parentWeb = clientContext.get_web();

            SPContext.Groups = parentWeb.get_siteGroups(); 
            cContext.load(SPContext.Groups);

            function onGetGroupsSucceed() {
                var SPData = {
                    UserGroups: []
                };

                var listItemInfo = '';
                var listItemEnumerator = SPContext.Groups.getEnumerator();

                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    $('#AuthorsGroupSelect').append('<option value="' + oListItem.get_title() + '">' + oListItem.get_title() + '</option>');
                    SPData.UserGroups.push(oListItem);
                }
                $("#AuthorsGroupSelect").val($("#AuthorsGroupSelect option:first").val());

                SPContext.Groups = SPData.UserGroups;

                if (CallBackFunction != null) {
                    CallBackFunction();
                }
            }
            function onGetGroupsFailed(sender, args) {
                alert('Get Groups failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }
            cContext.executeQueryAsync(
                    Function.createDelegate(this, onGetGroupsSucceed), 
                    Function.createDelegate(this, onGetGroupsFailed)
                );
        },

        //Permissions functions
        TestIsMember: function (groupName) {
            alert('started check');
            var ctext = new SP.ClientContext.get_current();
            var currentWeb = ctext.get_web();

            var currentUser = ctext.get_web().get_currentUser();
            ctext.load(currentUser);

            var allGroups = currentWeb.get_siteGroups();
            ctext.load(allGroups);

            var group = allGroups.getByName(groupName);
            ctext.load(group);

            var groupUsers = group.get_users();
            ctext.load(groupUsers);

            var fn1 = function (sender, args) {
                var userInGroup = false;
                alert('success');
            };
            var fn2 = function (sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            };

            ctext.executeQueryAsync(fn1, fn2);
            alert('end check, async called');
        },
        IsCurrentUserMemberOfGroup: function (groupName, OnComplete) {
            
            var currentContext = new SP.ClientContext.get_current();
            var currentWeb = currentContext.get_web();
            
            var currentUser = currentContext.get_web().get_currentUser();
            currentContext.load(currentUser);

            var allGroups = currentWeb.get_siteGroups();
            currentContext.load(allGroups);

            var group = allGroups.getByName(groupName);
            currentContext.load(group);

            var groupUsers = group.get_users();
            currentContext.load(groupUsers);
            
            function onPermsSuccessFn(sender, args) {
                var userInGroup = false;
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() == currentUser.get_id()) {
                        userInGroup = true;
                        break;
                    }
                }
                OnComplete(userInGroup);
            } 
            function onPermsFailureFn(sender, args) {
                //OnComplete(false);                
                if (args.get_message() == "Group cannot be found.") {
                    alert('Group cannot be found. Please create the group ' +  groupName  + '.');
                }
                if (args.get_message() == "Access denied. You do not have permission to perform this action or access this resource.") {
                    alert("Access denied to group " +  groupName  +  ". You do not have permission to perform this action or access this resource.");
                }

                else {
                    alert('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
                }
            }

            currentContext.executeQueryAsync(
                Function.createDelegate(this, onPermsSuccessFn),
                Function.createDelegate(this, onPermsFailureFn));
        },
        IsCurrentUserSiteCollectionAdmin: function () {
            var currentUser;

            function IsUserAdmin() {
                clientContext = SP.ClientContext.get_current();
                spWeb = clientContext.get_web();
                currentUser = spWeb.get_currentUser();
                clientContext.load(currentUser);
                clientContext.executeQueryAsync(
                    Function.createDelegate(this, onAdminQuerySucceeded),
                    Function.createDelegate(this, onAdminQueryFailed));
            }

            function onAdminQuerySucceeded(sender, args) {
                var isUserAdmin = currentUser.get_isSiteAdmin();
                if (isUserAdmin) {
                    //alert('Current User is Administrator');
                }
                else {
                    //alert('Current User is not an Administrator');
                }
            }

            function onAdminQueryFailed(sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            }

            IsUserAdmin();
        },
        DoesCurrentUserHaveEditRights: function(onSuccess, onFailure){
            context = new SP.ClientContext.get_current();
            callBack = onSuccess;
            secondCallBack = onFailure;

            web = context.get_web();
            this._currentUser = web.get_currentUser();
            context.load(this._currentUser);
            context.load(web, 'EffectiveBasePermissions');
            context.executeQueryAsync(
                Function.createDelegate(this, onPermsSuccessMethod),
                Function.createDelegate(this, onPermsFailureMethod));

            function onPermsSuccessMethod(sender, args) {
                if (web.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems)) {
                    //User Has Edit Permissions
                    if (callBack != null && callBack != undefined && typeof (callBack) == 'function')
                        callBack();
                }
                else {
                    if (secondCallBack != null && secondCallBack != undefined && typeof (secondCallBack) == 'function')
                        secondCallBack();
                }
            }
            function onPermsFailureMethod(sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            }
        },
        DoesCurrentUserHaveEditRightsToList: function (listName, onSuccess) {
            context = new SP.ClientContext.get_current();
            callBack = onSuccess;

            web = context.get_web();
            this._currentUser = web.get_currentUser();
            context.load(this._currentUser);
            context.load(web, 'EffectiveBasePermissions');
            context.executeQueryAsync(
                Function.createDelegate(this, onPermsSuccessMethod),
                Function.createDelegate(this, onPermsFailureMethod));

            function onPermsSuccessMethod(sender, args) {
                if (web.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems)) {
                    //User Has Edit Permissions
                    if (callBack != null && callBack != undefined && typeof (callBack) == 'function')
                        callBack();
                }
                else {
                    alert('The current user does not have edit rights to this current web context');
                }
            }
            function onPermsFailureMethod(sender, args) {
                alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
            }
        },

        //Ajax Call backs

        //to be removed
        onGetListSucceeded: function (sender, args) {
            this.GetADGroups();

            //Get the current working page
            var pageName = BrightCove.BCApp.Utilities.GetCurrentPageName();

            //Initialize the menus and breadcrumbs
            BrightCove.BCApp.Menus.Initialize(pageName);

            //Invoke the main page event
            BrightCove.BCApp.Initialize.InitializePageLoadEvent(pageName);
        },
        onGetVideoByIdSucceeded: function (sender, args) {
            var listItemInfo = '';
            var listItemEnumerator = SPContext.DataStore2.getEnumerator();
            var vid = BrightCove.BCApp.Utilities.GetQueryStringParameter('vid');

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();

                var cvid = oListItem.get_id();

                if (cvid == vid) {
                    var newData = BrightCove.BCApp.Utilities.CreateVideoObjectFromListItem(oListItem);
                    SPContext.DataStore2 = newData;
                    break;
                }
            }

            SPContext.ViewObject().LoadData();
        },

        //to be removed
        onGetListFailed: function (sender, args) {
            alert('Request failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        },
        onAddVideoItem: function () {
            //alert('SharePoint Item Updated');
            console.log('SharePoint Video Item Updated');
        },
        onAddListItem: function () {
            alert('SharePoint Item Updated');
            location.href = location.href; 
        },
        onUpdateListItem: function () {
            alert('SharePoint Item Updated');
        },
        onAddListItemFailed: function (sender, args) {
            alert('Add failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        },
        onUpdateListItemFailed: function (sender, args) {
            alert('Update failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        },
        onDeleteSucceeded: function () {
            alert('Item deleted');
        },
        onDeleteFailed: function (sender, args) {
            alert('Delete failed. ' + args.get_message() +
                '\n' + args.get_stackTrace());
        }
    }
};
BrightCove.BCApp.BrightCoveUtilities = {
    VideoDAL: {
        //Video functions
        GetBCVideosByID: function (VideoIDs, token, CallBackFunction, refElem) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_ids"
                    + "&video_ids=" + VideoIDs.replace(',', '%2C') 
                    + "&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2ClinkURL%2ClinkText%2Ctags%2CreferenceId%2Ceconomics%2CaccountId%2CitemState%2CstartDate%2CendDate"
                    + "&media_delivery=default"
                    + "&token=" + token; 

            var modalEditMode = function () {
                //load data
                $('#ddlNewType').change();
                $('.modal-header h4 span').html('Edit Playlist');
                $('.newPlaylistModal .editMode').show();
            }
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    if (json != null && json.items != null) {

                        $(json.items).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            newData.VideoID = 0;
                            newData.Account = item.accountId;
                            newData.VideoTitle = item.name;
                            newData.VideoShortDescription = (item.shortDescription != 'null') ? item.shortDescription : '';
                            newData.VideoLongDescription = (item.longDescription != 'null') ? item.longDescription : '';
                            newData.VideoStartDate = (item.startDate != 'null') ? (new Date(item.startDate)).toLocaleDateString() : '';
                            newData.VideoEndDate = (item.endDate != 'null') ? (new Date(item.endDate)).toLocaleDateString() : '';
                            newData.ReferenceID = item.id;
                            newData.RelatedLink = (item.linkURL != 'null') ? item.linkURL : '';
                            newData.RelatedLinkText = (item.linkText != 'null') ? item.linkText : '';
                            newData.Economics = item.economics;
                            newData.Active = item.itemState;
                            newData.VideoThumbNail = '';
                            newData.VideoStillImage = '';
                            newData.Keywords = (item.tags != null && item.tags != undefined && item.tags.length > 0) ? item.tags.join(',') : '';

                            SPData.VideoListData.push(newData);
                        });
                        SPContext.DataStore2 = SPData.VideoListData;

                        if (CallBackFunction != null && CallBackFunction != undefined && refElem != null)
                            CallBackFunction(refElem);
                        else if (CallBackFunction != null && CallBackFunction != undefined) {
                            CallBackFunction(SPData.VideoListData);
                        }
                    }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                }
            });
        },
        GetBCVideosByReferenceID: function (VideoIDs, token, CallBackFunction, refElem) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_video_by_reference_id"
                    + "&reference_id=" + VideoIDs.replace(',', '%2C') 
                    + "&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2CcreationDate%2CpublishedDate%2ClinkURL%2ClinkText%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2CreferenceId%2Ceconomics%2CaccountId%2CitemState%2CstartDate%2CendDate%2linkURL%2linkText"
                    + "&media_delivery=default"
                    + "&token=" + token;

            var modalEditMode = function () {
                //load data
                $('#ddlNewType').change();
                $('.modal-header h4 span').html('Edit Playlist');
                $('.newPlaylistModal .editMode').show();
            }
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    try {
                        if (json != null && json.items != null) {

                            $(json.items).each(function (index, item) {
                                var newData = new BrightCove.BCApp.DataStructures.PlaylistData();

                                newData.VideoTitle = item.name;
                                newData.ReferenceID = item.referenceId;
                                newData.VideoID = item.id;

                                SPContext.BCVideoIDReference().push(newData);
                            });

                            if (CallBackFunction != null && CallBackFunction != undefined)
                                CallBackFunction(refElem);
                        }
                    }
                    catch (err) { }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                }
            }).done(function () {

            });
        },
        GetBCVideosByTagID: function (VideoIDs, token, CallBackFunction) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_tags"
                    + "&and_tags=" + VideoIDs
                    + "&media_delivery=default"
                    + "&token=" + token;

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    try {
                        if (json != null && json.items != null) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            $(json.items).each(function (index, item) {
                                var found = false;

                                if (item.tags != null && item.tags.length > 0) {
                                    $(item.tags).each(function (tindex, titem) {
                                        if (titem == VideoIDs) {
                                            newData.VideoTitle = item.name;
                                            newData.ReferenceID = item.id;
                                            found = true;
                                        }                                        
                                    });
                                }
                            });

                            if (CallBackFunction != null && CallBackFunction != undefined)
                                CallBackFunction(newData);
                        }
                    }
                    catch (err) { }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                    if (CallBackFunction != null && CallBackFunction != undefined)
                        CallBackFunction(null);
                }
            }).done(function () {

            });
        },
        GetBCVideosByTags: function (tags, token, CallBackFunction) {
            var SPData = {
                VideoListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_videos_by_tags"
                    + "&and_tags=" + VideoIDs
                    + "&media_delivery=default"
                    + "&token=" + token;

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                cache: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    try {
                        //alert(json);
                        if (json != null && json.items != null) {
                            var newData = new BrightCove.BCApp.DataStructures.VideoData();

                            $(json.items).each(function (index, item) {
                                var found = false;

                                if (item.tags != null && item.tags.length > 0) {
                                    $(item.tags).each(function (tindex, titem) {
                                        if (titem == VideoIDs) {
                                            newData.VideoTitle = item.name;
                                            newData.ReferenceID = item.id;
                                            found = true;
                                        }
                                    });
                                }
                            });

                            if (CallBackFunction != null && CallBackFunction != undefined)
                                CallBackFunction(newData);
                        }
                    }
                    catch (err) { }
                },
                error: function (e) {
                    alert('Error retrieving video ids from Brightcove... '
                        + e.toString());
                    if (CallBackFunction != null && CallBackFunction != undefined)
                        CallBackFunction(null);
                }
            }).done(function () {

            });
        },
        //Playlist functions
        GetBCPlaylists: function (CallBackFunction, token) {
            SPContext.DataStore2 = null;
            var SPData = {
                PlayListData: []
            };

            var url = "https://api.brightcove.com/services/library?command=find_all_playlists"
                + "&playlist_fields=id%2Cname%2CshortDescription%2CplayListType%2Cvideos%2CvideoIds%2CaccountId%2CreferenceId%2CshortDescription%2CfilterTags%2CplaylistType"
                + "&video_fields=id%2Cname%2CshortDescription%2ClongDescription%2CcreationDate%2CpublishedDate%2ClinkURL%2ClinkText%2Ctags%2CvideoStillURL%2CvideoStill%2CthumbnailURL%2Cthumbnail%2CreferenceId%2Ceconomics%2CaccountId%2CitemState%2CstartDate%2CendDate"
                + "&media_delivery=default&page_number=0&get_item_count=true"
                + "&token=" + token; 

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    if (json != null && json.items != null) {

                        $(json.items).each(function (index, item) {
                            var newData = new BrightCove.BCApp.DataStructures.PlaylistData();

                            newData.Title = item.name;
                            newData.Thumbnail = item.thumbnailURL;
                            newData.ShortDescription = item.shortDescription;
                            newData.StartDate = item.creationDate;
                            newData.Type = item.playListType;
                            newData.EndDate = item.endDate;
                            newData.ReferenceID = item.referenceId;
                            newData.ID = item.id;
                            newData.PlaylistType = item.playlistType;
                            newData.Tags = (item.filterTags != null && item.filterTags.length > 0) ? item.filterTags.join(',') : '';
                            
                            if (item.videoIds != null && item.videoIds != undefined && item.videoIds.length > 0) {
                                newData.VideoIDs = item.videoIds.join(',');
                            }
                            else
                                newData.VideoIDs = '';
                            
                            SPData.PlayListData.push(newData);
                        });
                        SPContext.DataStore2 = SPData.PlayListData;
                    }
                    
                    if (CallBackFunction != null)
                        CallBackFunction(SPData.PlayListData);
                },
                error: function (e) {
                    alert('Error retrieving playlists from Brightcove... '
                        + e.toString());
                }
            });
        }
    },
    JSONUtilities: {
        CreateVideo: function (title, spid, tags,
            videoShortDescription, videoLongDescription,
            relatedLinkUrl, relatedLinkText, activeInactive, economics,
                startDate, endDate, token) {
            tags = this.FormatTagsForJSON(tags, spid);
            //remove empty tags to avoid issues
            tags = BrightCove.BCApp.Utilities.ReplaceAll(tags, ",\"\"", "")
            if (startDate == null || startDate == undefined || startDate == '' || startDate == 'Invalid Date') {
                startDate = '';
            }
            if (endDate == null || endDate == undefined || endDate == '' || endDate == 'Invalid Date') {
                endDate = '';
            }
            if (startDate != '') {
                var EpochStartDate = new Date(startDate);
                startDate = EpochStartDate.getTime();
            }
            if (endDate != '') {
                var EpochEndDate = new Date(endDate);
                endDate = (endDate != '') ? EpochEndDate.getTime() : '';
            }


            var jval = '{"method": "create_video", "params": {"video": {"name": "'
                    + title + '",'
                    + '"tags": ['
                    + tags
                    + '],'
                    + '"shortDescription": "' + videoShortDescription + '",'
                    + '"longDescription": "' + videoLongDescription + '",'
                    + '"linkURL": "' + relatedLinkUrl + '",'
                    + '"linkText": "' + relatedLinkText + '",'
                    + '"economics": "' + economics + '",'
                    + ((startDate != null && startDate != '') ? '"startDate": ' + startDate + ',' : '')
                    + ((endDate != null && endDate != '') ? '"endDate": ' + endDate + ',' : '')
                    + '"itemState": "' + activeInactive
                    + '"},'
                    + '"token": "' + token + '",'                    
                    + '"encode_to":"MP4",'
                    + '"create_multiple_renditions": "FALSE"}}';

            return jval;
        },

        UpdateVideo: function (title, videoId, spid, tags,
            videoShortDescription, videoLongDescription,
            relatedLinkUrl, relatedLinkText, activeInactive, economics,
            startDate, endDate, token) {
            tags = this.FormatTagsForJSON(tags, spid);

            if (startDate == null || startDate == undefined || startDate == '' || startDate == 'Invalid Date') {
                startDate = '';
            }
            if (endDate == null || endDate == undefined || endDate == '' || endDate == 'Invalid Date') {
                endDate = '';
            }
            if (startDate != '') {
                var EpochStartDate = new Date(startDate);
                startDate = EpochStartDate.getTime();
            }
            if (endDate != '') {
                var EpochEndDate = new Date(endDate);
                endDate = (endDate != '') ? EpochEndDate.getTime() : '';
            }

            var jval = '{"method": "update_video", "params": {'
                        + '"token": "' + token + '",'
                        + '"video": {'
                        + '"id": ' + videoId + ','
                        + '"name": "' + title + '",'
                        + '"tags": ['
                        + tags.replace(',""', '') 
                        + '],'
                        + '"shortDescription": "' + videoShortDescription + '",'
                        + '"longDescription": "' + videoLongDescription + '",'
                        + '"linkURL": "' + relatedLinkUrl + '",'
                        + '"linkText": "' + relatedLinkText + '",'
                        + '"itemState": "' + activeInactive + '",'
                        + ((startDate != null && startDate != '') ? '"startDate": ' + startDate + ',' : '')
                        + ((endDate != null && endDate != '') ? '"endDate": ' + endDate + ',' : '')
                        + '"economics": "' + economics + '"'
                        + '}'
                        + ',"encode_to":"MP4",'
                        + '"create_multiple_renditions": "FALSE"'
                        + '}}';

            return jval;
        },
        CreatePlaylist: function (title, videoIds, description, token) {

            var jval = '{"method":"create_playlist","params":{"playlist":{"playlistType":' + ((true) ? '"EXPLICIT",' : '')
                     + '"videoIds":[' + videoIds
                     + '],"name":"' + title + '"'
                     + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                     + '},"token":"' + token + '"'
                     + '}}';
            return jval;
        },
        UpdatePlaylist: function (title, playlistId, description, videoIds, token) {

            var jval = '{"method":"update_playlist","params":{"playlist":{'
                     + '"id":"' + playlistId + '",'
                     + '"playlistType":' + ((true) ? '"EXPLICIT",' : '')
                     + '"videoIds":[' + videoIds
                     + '],"name":"' + title + '"'
                     + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                     + '},"token":"' + token
                     + '"}}';
            return jval;
        },
        CreateSmartPlaylist: function (title, description, tags, condition, playListType, totalVideos, token) {
            //the total videos field is not supported by brightcove. It has been left as a place-holder for future implementations
            tags = this.FormatTagsForJSON(tags);
            var jval = '{"method":"create_playlist","params":{"playlist":{'
                         + '"playlistType":"' + playListType + '",'
                         + '"filterTags":' + '[' + tags + '],'
                         + '"tagInclusionRule":"' + condition + '",'
                         + '"name":"' + title + '"'
                         + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                         + '},"token":"' + token
                         + '"}}';
            return jval;
        },
        UpdateSmartPlaylist: function (title, description, playlistId, tags, condition, playListType, totalVideos, token) {
            //the total videos field is not supported by brightcove. It has been left as a place-holder for future implementations
            tags = this.FormatTagsForJSON(tags);
            var jval = '{"method":"update_playlist","params":{"playlist":{'
                         + '"id":"' + playlistId + '",'
                         + '"filterTags":' + '[' + tags + '],'
                         + '"playlistType":"' + playListType + '",'
                         + '"tagInclusionRule":"' + condition + '",'
                         + '"name":"' + title + '"'
                         + ((description != null && description != '') ? ',"shortDescription": ' + '"' + description + '"' : '')
                         + '},"token":"' + token
                         + '"}}';
            return jval;
        },
        DeletePlaylist: function (playListId, token) {
            var jval = '{"method": "delete_playlist", "params":{"playlist_id": ' + playListId
                    + ',"token": "' + token + '"}}';
            return jval;
        },
        FormatTagsForJSON: function (tags, guid) {
            tags = tags.split(',');
            var ftags = '';
            if (guid != null && guid.length > 0) {
                ftags += '"' + guid + '"';
            }
            if (tags != null && tags.length > 0) {
                if (guid != null && guid.length > 0) {
                    ftags += ",";
                }
                for (i = 0; i < tags.length; i++) {
                    ftags += '"' + tags[i] + '"';
                    if (i + 1 < tags.length)
                        ftags += ',';
                }
            }

            return ftags;
        },
        FormatAndTagsForRequest: function (tags) {
            tags = tags.split(',');
            var ftags = '';
            if (tags != null && tags.length > 0) {
                for (i = 0; i < tags.length; i++) {
                    ftags += '&and_tags=' + tags[i] + '';
                }
            }

            return ftags;
        },
        FormatOrTagsForRequest: function (tags) {
            tags = tags.split(',');
            var ftags = '';
            if (tags != null && tags.length > 0) {
                for (i = 0; i < tags.length; i++) {
                    ftags += '&or_tags=' + tags[i] + '';
                }
            }

            return ftags;
        }
    }
};
BrightCove.BCApp.Installer = {
    Get_isListExists: function (listTitle, OnSuccess, OnError) {
        var ctx = SP.ClientContext.get_current();
        var web = ctx.get_web();
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
          OnError()
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
        //listCreation.set_templateType(templateType);
        listCreation.set_url(url);

        //must use the hostWebContext to get the list in that site
        var lists = hostWebContext.get_web().get_lists();
        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary) {
            listCreation.set_templateType(SP.ListTemplateType.documentLibrary);
        }
        else
        {
            listCreation.set_templateType(templateType);
        }
        var list = lists.add(listCreation);
        list.set_hidden(hidden);
        list.set_onQuickLaunch(false);

        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts) {        
            BrightCove.BCApp.Installer.GenerateAccountsListSchema(list);
        }
        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList) {            
            BrightCove.BCApp.Installer.GenerateVideoListSchema(list);
        }
        if (title == BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary) {            
            BrightCove.BCApp.Installer.GenerateVideoImageListSchema(list);
        }

        list.update();
        //Always use the context of the app web to do the work or load and executing
        clientContext.load(list);
        
        clientContext.executeQueryAsync(function () {
            $('#errorMessage').text("Created List : \"" + title + "\"");
            var btnClass = $("#btn" + title).attr('class') + ' hidden';
            $("#btn" + title).attr('class', btnClass);
            if (!$('#btn' + BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts).is(':visible')
                && !$('#btn' + BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList).is(':visible')
                && !$('#btn' + BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary).is(':visible')) {
                BrightCove.BCApp.Installer.ShowNavigationButtons();
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
        list.get_fields().addFieldAsXml('<Field DisplayName=\'Economic\' Type=\'Choice\' ><CHOICES><CHOICE>Ad Supported</CHOICE><CHOICE>Bronz</CHOICE><CHOICE>Silver</CHOICE><CHOICE>Gold</CHOICE></CHOICES></Field>',
            true, SP.AddFieldOptions.defaultValue);
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
    HideNavigationButtons: function () {
        $('.leftNav .btn').each(function (index, value) {
            if (index > 0) {
                var button = $(this);
                var btnclass = "btn btn-default btn-lg btn-block disabled";
                button.attr('class', btnclass);
            }
        });
    },
    ShowNavigationButtons: function () {
        $('.leftNav .btn').each(function (index, value) {
            if (index > 0) {
                var button = $(this);
                var btnclass = "btn btn-default btn-lg btn-block";
                button.attr('class', btnclass);
            }
        });
    },
    CheckLists: function () {
        var lists =
            [BrightCove.BCApp.Constants.SharePointConstants.SPListID_Accounts,
             BrightCove.BCApp.Constants.SharePointConstants.SPListID_VideoList,
             BrightCove.BCApp.Constants.SharePointConstants.SPListID_ImageLibrary];
        var showNavigation = true;
        BrightCove.BCApp.Menus.Initialize('Default.aspx');
        BrightCove.BCApp.Installer.ShowNavigationButtons();
        lists.forEach(
            function (entry) {
                BrightCove.BCApp.Installer.Get_isListExists(entry,
                    function (listExists) {
                        if (listExists == false) {
                            BrightCove.BCApp.Installer.HideNavigationButtons();
                            var btnClass = $("#btn" + entry).attr('class').replace('hidden', '');
                            $("#btn" + entry).attr('class', btnClass);
                        }
                    },
                    function (sender, args) {
                        //$('#errorMessage').text(args.get_message());
                        
                    });
            });
    }
};
//**************************************************************************************************
//Test Area
//**************************************************************************************************   
/*//reference ajax call
            $.ajax({
                url: "/default.aspx",
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                error: function (ex) {
                    alert('error logged: ' + ex);
                },
                success: function (data) {
                    
                    //return jsonData;
                    //CallBackFunction(jsonData);
                }
            });
    //reference ko remove array item
    
                    //var item;
                    //ko.utils.arrayForEach(this.Items, function (v) {
                    //    if (v.id == itemid) {
                    //        item = v;
                    //    }
                    //});

                    //ko.utils.arrayRemoveItem(this.Items, item);

                    //Add/delete items from KO
                    me.AddItem = function (item) {
                    me.AccountListData.push(item);
                };
                me.DeleteItem = function (itemid) {
                    if (itemid == null || itemid.length < 1)
                        return false;
                    me.AccountListData.remove(function (item) {
                        return item.PropertyId == itemid;
                    });
                };

                //KO Pushall call
                //ko.observableArray.fn.pushAll = function (valuesToPush) {
            //    var underlyingArray = this();
            //    this.valueWillMutate();
            //    ko.utils.arrayPushAll(underlyingArray, valuesToPush);
            //    this.valueHasMutated();
            //    return this;
            //};

            
            //newObj.AddItem({
            //    PropertyName: 'Property 1',
            //    PropertyId: '01',
            //    PropertyValue: '012345',
            //    AccountAuthorsGroup: '012345',
            //    AccountViewersGroup: '987654',
            //    AccountAuthorsGroupName: 'Internal Auths',
            //    AccountViewersGroupName: 'Internal View'
            //});
            //newObj.DeleteItem('01')



            
            //alert('Saving...');
            
            //var fdata = "[{'name':'JSONView','value':'{\"method\":\"create_playlist\",\"params\":{\"playlist\":{\"playlistType\":\"EXPLICIT\",\"videoIds\":"
            //    + "[3816095444001]"
            //    + ",\"shortDescription\":\"A new playlist\",\"name\":\""
            //    + plname
            //    + "\"},\"token\":\"OSpK6k_-o4zKQ1FbJSipXrgSt4TyttBwlsOwFakMN2iJKyjS1AGT7w..\"}}'}]";
            //var fdata = [{ name: 'JSONView', value: '{"method":"create_playlist","params":{"playlist":{"playlistType":"EXPLICIT","videoIds":[3816095444001],"shortDescription":"A new playlist","name":"Test Playlist2ddsdf adsf adsf"},"token":"OSpK6k_-o4zKQ1FbJSipXrgSt4TyttBwlsOwFakMN2iJKyjS1AGT7w.."}}' }];
            //fdata = JSON.stringify(fdata);
            //var json = '{"method":"create_playlist","params":{"playlist":{"playlistType":"EXPLICIT","videoIds":[3816095444001],"shortDescription":"A new playlist","name":"Test Playlist2ddsdf adsf adsf"},"token":"OSpK6k_-o4zKQ1FbJSipXrgSt4TyttBwlsOwFakMN2iJKyjS1AGT7w.."}}';

            //alert(fdata);

            //$.ajax({
            //    type: "POST",
            //    url: "https://api.brightcove.com/services/post",
            //    data: fdata,
            //    async: false,
            //    crossDomain: true,
            //    xhrFields: {
            //        withCredentials: false
            //    },
            //    success: function (res) {
            //        alert(res);

            //        //Update Functions Here!!!
            //        $('.newPlaylistModal').modal('hide');
            //    }, 
            //    error: function(err){
            //        alert('failure: ' + err.toString());
            //    },
            //    dataType: "html",
            //    contentType: "multipart/form-data"
            //});



            
                //jval = '{"method": "create_video", "params": {"video": {"name": "'
                //    + me.VideoData().VideoTitle() + '",'
                //    + '"referenceId":"' + me.VideoData().SPID() + '"'
                //    + ',"tags": ['
                //    + ftags
                //    + '],"shortDescription": "'
                //    + me.VideoData().VideoShortDescription() + '","itemState": "'
                //    + 'active' + '"},"token": "'
                //    + $('#ddlSelectAccount > option:selected').val() + '",  "encode_to":"'
                //    + 'MP4' + '",  "create_multiple_renditions": "'
                //    + 'FALSE' + '"}}';
*/