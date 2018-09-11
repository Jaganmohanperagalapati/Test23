function showSpinner(page) {
    hideIframe(page);
    $( "#nma-no-proxy" ).hide();
    $( "#nma-choose-proxy" ).hide();
    $( "#api-error" ).hide();
    $( "#region-backend" ).hide();
    $( "#teen-proxy" ).hide();
    $( "#no-pap" ).hide();
    $( "#loading" ).show();
}
function hideIframe(page) {
    var iframe = getIframe(page);
    iframe.addClass('tile-hide');
	iframe.removeClass('tile-show');
}
function showIframe(page) {
    var iframe = getIframe(page);
	iframe.addClass('tile-show');
    iframe.removeClass('tile-hide');
}
function insertMessagesComponent(page){
    var iframe = getIframe(page);
    $('#proxy-picker-container').after($('#nma-no-proxy'));
    $('#proxy-picker-container').after($('#nma-choose-proxy'));
    iframe.before($('#api-error'));
    iframe.before($('#loading'));
    iframe.before($('#region-backend'));
    iframe.before($('#teen-proxy'));
    iframe.before($('#no-pap'));
}
function getIframe(page){
    var iframe;
    if(page){
        iframe = $("[data-module-name=" + page+ "]");
    }else{
        //if page is not passed then the iframe is considered to have id as datatilesframe
        iframe = $('#datatilesframe');
    }
    if(iframe.length==0){
        iframe = $('#datatilesframe');
    }
    return iframe;
}
function hideSpinner() {
    $("#loading").hide();
}
function showNmaNoProxyMsg(page) {
    $("#nma-no-proxy").show();
    hideIframe(page);
}
function fetchRelatedLinks(page){
    var relatedLinks;
    if (window.hasOwnProperty('jsonConfigs') && window.jsonConfigs.feature) {
        if (window.jsonConfigs.feature["RelativeLinksURL"]) {
            relatedLinks = window.jsonConfigs.feature.RelativeLinksURL;
        }
    }
    return relatedLinks;
};
function hideRelatedLinksforNMA(relatedLinks){
var listItems = $("ul.link-list li a");
for (var i = 0; i<listItems.length; i++){
    for (var j in relatedLinks) {
        if((listItems[i].href.indexOf(relatedLinks[j])) > -1){
			      listItems[i].parentElement.setAttribute("class","tile-hide");
        }
	}
}
};
function showRelatedLinksforMember(relatedLinks){
var listItems = $("ul.link-list li a");
for (var i = 0; i<listItems.length; i++){
    for (var j in relatedLinks) {
        if((listItems[i].href.indexOf(relatedLinks[j] )) > -1){
			      listItems[i].parentElement.setAttribute("class","tile-show");
        }
	}
}
};
function showNmaProxyMsg(page) {
    $("#nma-choose-proxy").show();
    hideIframe(page);
    hideSpinner();
}
function showAPIErrorMsg(){
    console.log("api error");
    $("#api-error").show();
}
function showEntitlementErrorMsg(){
    console.log("entitlement error");
    $("#teen-proxy").show();
}
function checkNma(data, page) {
    if (data.isProxyApiSuccess && data.user.proxyCount == 0) {
        console.log("nma no proxy");
        showNmaNoProxyMsg(page);
    }
}
 function checkNmaProxy(data, page) {
    if (data.isProxyApiSuccess && data.user.proxyCount > 0) {
        console.log("nma proxy");
        showNmaProxyMsg(page);
    }
}
function getDeploymentId(relId) {
    var userProfile = window.$kp.KPUserProfile.UserProfileClient;
    if (relId) {
        var selectedProxy = userProfile.getProxies().filter(function(proxy) {
        return proxy.relationshipID === relId;
      });
      return selectedProxy[0] && selectedProxy[0].deploymentId ?
      selectedProxy[0].deploymentId : userProfile.getUser().deploymentId;
    }
    return userProfile.getUser().deploymentId;
  }
function showProxyinMobile(){
  var width = Math.max($(window).width(), window.innerWidth);
  if(width <= 768){
    console.log("mobile");
    $('.layout_two-column').before($("#proxy-picker-container"));
  }else{
    $('.layout_two-column').after($("#proxy-picker-container"));
  }
};
function showRelatedLinksinMobile(){
    var width = Math.max($(window).width(), window.innerWidth);
    if(width <= 768){
      console.log("mobile");
      $(".content-main").after($('.link-list-container'));
    }
  };
function hidePreText(classContainer){
    console.log("Inside MMR Utils");
    if(classContainer!=null && $(classContainer).prev()[0]!=null && $(classContainer).prev()[0].className == "text parbase"){
		$(classContainer).prev().hide();
	}
}
function hidePostText(classContainer){
    if(classContainer!=null && $(classContainer).next()[0]!=null && $(classContainer).next()[0].className == "text parbase"){
		$(classContainer).next().hide();
	}
}
function showPreText(classContainer){
    if(classContainer!=null && $(classContainer).prev()[0]!=null && $(classContainer).prev()[0].className == "text parbase"){
		$(classContainer).prev().show();
	}
}
function showPostText(classContainer){
    if(classContainer!=null && $(classContainer).next()[0]!=null && $(classContainer).next()[0].className == "text parbase"){
		$(classContainer).next().show();
	}
}
/* extraLocationParams: {"abc":"c1", "mnp":"c2", "xyz":"c3"} */
function fetchEpicUrls(relId, locationParams, page){
    showSpinner(page);
    var epicURL;
    var kphcidParam = getDeploymentId(relId);
    console.log("kphcidParam from user object:" + kphcidParam);
    if (!kphcidParam) {
        //handle error scenario
        console.error("kphcid is not exist in user object");
        hideSpinner();
        showAPIErrorMsg();
        return;
    }
    var deploymentID = kphcidParam.substr(kphcidParam.lastIndexOf(":") + 1);
    if (deploymentID) {
        if (window.hasOwnProperty('jsonConfigs') && jsonConfigs.feature) {
            if (jsonConfigs.feature[deploymentID]) {
                epicURL = jsonConfigs.feature[deploymentID];
            }
        }
        if (!epicURL) {
            // there is no config for this deploymentID. getting the pattern for fetching the sub region
            var lastChars = deploymentID.substr(deploymentID.length - 3);
            var sRegion = lastChars.substring(0, lastChars.length - 1);
            epicURL = "/hconline/" + sRegion + "/inside.asp";
        }
    } else {
        console.error("deploymentID is not available via kphcid");
        hideSpinner();
        showAPIErrorMsg();
        return;
    }
    var language = "english";
    if ($kp.KPClientCommons.CookieManager && $kp.KPClientCommons.CookieManager.getLanguageCookie() == "es-US") {
        language = "espanol";
    }
    var langParam = "?lang=" + language;
    var sLocParam="";
    if(locationParams)
    {
        for(var location in locationParams) {
            sLocParam += "&"+location+"="+locationParams[location];
        }
    }else{
        console.log("EPic configuration missing. It is not passed and is mandatoty");
        return;
    }
    //epicURL = encodeURI(epicURL + "?mode=" + mode + "&kphcid=" + kphcidParam + langParam + sLocParam);
    epicURL = encodeURI(epicURL + langParam + sLocParam);
    console.log("epicURL URL:" + epicURL);
    var iframe = getIframe(page);
    iframe.prop('src', epicURL);
    iframe.on('load', function() {
        // do stuff
        hideSpinner();
        if(this.getAttribute('data-module-name')==='contactsrx'){
            this.style.height = this.contentWindow.document.body.scrollHeight + PX;
        }
        if(this.getAttribute('data-module-name')==='authorize-sharing'|| 'viewed-by'){
           $('.action-area-container').css({'display': "block", 'background-color':'#F4F5F6'});
       }
        showIframe(this.getAttribute('data-module-name'));
        this.setAttribute('title', document.title);
        //var footerComp = iframeComp.contentWindow.document.body;
       	//var footerElement = $(footerComp).find("#footer").hide();
    });
};
function mainDataTileFunction(page){
    if(window.$kp)
        var userProfileClient = window.$kp.KPUserProfile.UserProfileClient;
    else
        return;
    userProfileClient.load().then(function(data) {
      if(!data.isEntitlementsApiSuccess){
            //EntitlementsApi is not success
            console.log("Entitlement is in error");
            $("#user-profile-error").show();
            return;
        }
      // This will show the page container
      $(".mmr-container").show();
      $("#user-profile-error").hide();
      insertMessagesComponent(page);
      showProxyinMobile();
      showRelatedLinksinMobile();
        if (data.user.isMember|| (data.isProxyApiSuccess && window.$kp.KPProxyPicker.ProxyPickerClient.isProxySelected())) {
            var proxyCookie = window.$kp.KPProxyPicker.ProxyPickerClient.getRelationshipId();
            var relId;
            if (proxyCookie !== 'self')
                relId = proxyCookie;
            fetchEpicUrls(relId,fetchEpicConfig(page), page);
        }else {
            console.log("User is Non Member");
            // Hide Side Nav, Back Link, Pre Text and Post Text if user is not a member
    		$(".side-navigation").addClass('nav-hide');
    		$("#previousPageVALUE").addClass('nav-hide');
            hidePreText(".iframe");
            hidePostText(".iframe");
            hideRelatedLinksforNMA(fetchRelatedLinks());
            checkNma(data, page);
            checkNmaProxy(data, page);
        }
        window.$kp.KPProxyPicker.ProxyPickerClient.onChange(getProxyInfo);
    }, function(e) {
        console.log('rejected', e); // "rejected", 20
        $("#user-profile-error").show();
    });
};
function fetchEpicConfig(page){
    // fetch the page config from kpenvconfig
    var epicLocParam;
    if (window.hasOwnProperty('jsonConfigs') && window.jsonConfigs.feature) {
        console.log("page", page);
        if (window.jsonConfigs.feature[page]) {
            epicLocParam = window.jsonConfigs.feature[page];
        }
    }
    return epicLocParam;
};
function getProxyInfo(data) {
    var relId = data.relid === 'self' ? null : data.relid;
    var frames = document.getElementsByName("datatilesframe");
    if(data.error == 101 || data.error == 102){
       console.log("Entitlements call failed for" +data.relid);
        $("#proxy-picker-container").hide();
        $("#entitlement-api-error").show();
     }else{
        console.log("relId" + relId);
            $("#entitlement-api-error").hide();
            $("#proxy-picker-container").show();
        if(relId || window.$kp.KPUserProfile.UserProfileClient.getUser().isMember){
            // Show Side Nav, Back Link, Pre Text and Post Text if user is a member
            if($(".side-navigation").is(':hidden')){
                $(".side-navigation").removeClass('nav-hide');
            }
            if($("#previousPageVALUE").is(':hidden')){
                $("#previousPageVALUE").removeClass('nav-hide');
            }
            showPreText(".iframe");
            showPostText(".iframe");
			showRelatedLinksforMember(fetchRelatedLinks());
            for (var i = 0; i < frames.length; i++) {
                var module = frames[i].getAttribute('data-module-name');
                if(module && module!=='datatilesframe'){
                    fetchEpicUrls(relId,fetchEpicConfig(module), module);
                }
                else{
                    var page = this.document.page;
                    fetchEpicUrls(relId,fetchEpicConfig(page), page);
                }
            }
        }
        else{
            // Hide Side Nav, Back Link, Pre Text and Post Text if user is not a member
            $(".side-navigation").addClass('nav-hide');
            $("#previousPageVALUE").addClass('nav-hide');
            hidePreText(".iframe");
            hidePostText(".iframe");
            hideRelatedLinksforNMA(fetchRelatedLinks());
            var frames = document.getElementsByName("datatilesframe");
            for (var i = 0; i < frames.length; i++) {
                var module = frames[i].getAttribute('data-module-name');
                if(module && module!=='datatilesframe'){
                    showSpinner(module);
                    showNmaProxyMsg(module);
                }else{
                    var page = this.document.page;
                    showSpinner(page);
                    showNmaProxyMsg(page);
                }
            }

        }
     }
   };
