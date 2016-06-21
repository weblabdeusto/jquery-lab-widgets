
//
/**
 * Camera refresher. It takes the id of the image to refresh as an argument. 
 * When you want to start refreshing, just call start(). To stop refreshing, just call stop().
 * 
 * REMARK: This is essentially copy-pasted from Archimedes and could probably be improved.
 * 
 * @param img_id: ID of the <img> HTML element to refresh.
 * @constructor
 */
CameraRefresher = function (img_id) {

    var INTERVAL = 400; // Seconds to wait between image changes.

    var $img = $("#" + img_id);
    var _url;
    var _refreshingTimeout = null;


    //! Carry out initialization.
    //
    this._init = function () {
        // Ensure that the specified image exists.
        if ($img.length != 1) {
            console.error("[CameraRefresher]: The element with the tag " + img_id + " could not be found in the DOM");
            throw "Element not found";
        }
    };

    //! Sets the URL to load.
    //!
    this.setURL = function (url) {
        _url = url;
    };

    //! Refreshes the camera. If the automatic refresher has been
    //! started through start(), then this method is invoked
    //! periodically.
    this.refresh = function () {
        if (_url == undefined || _url == null)
            _url = $img.attr("src");
        $img.attr("src", this._get_timestamped_url(_url));
    };

    this._get_timestamped_url = function (url) {
        if (url.search("\\?") != -1) {
            return url + "&__ts=" + new Date().getTime();
        } else {
            return url + "?__ts=" + new Date().getTime();
        }
    };

    this._onLoad = function () {
        _refreshingTimeout = setTimeout(this.refresh.bind(this), INTERVAL);
    };

    //! Sets the number of milliseconds to wait after each image load.
    //!
    this.setInterval = function (interval) {
        INTERVAL = interval;
    };

    //! Gets the number of milliseconds to wait after each image load.
    //!
    this.getInterval = function () {
        return INTERVAL;
    };


    //! Initialization.
    this.showPlaceholder = function () {
        $img.attr("src", "img/video_placeholder.png");
    };

    //! Starts refreshing the specified URL.
    //!
    //! @param {str} url URL to refresh. A timestamp will be appended to each request to avoid caching issues.
    //! Can be undefined or null. If undefined or null, the current image source will be used as the URL
    //! to refresh.
    this.start = function (url) {

        // If null or empty we will use the previous URL.
        if (url == undefined || url == null || url.length == 0) {
            url = $img.attr("src");
        }

        // Stop the previous refresher if it's active.
        this.stop();


        console.log("ON");

        // Register the image loaded listener.
        $img.on("load error", function () {
            this._onLoad();
        }.bind(this));

        _url = url;

        this.refresh();
    };

    //! Stops refreshing.
    //!
    this.stop = function () {
        // Remove the load listener.
        $img.off("load error");

        if (_refreshingTimeout != null) {
            clearTimeout(_refreshingTimeout);
            _refreshingTimeout = null;
        }
    };


    // Call the ctor
    this._init();
}; // end-of CameraRefresher