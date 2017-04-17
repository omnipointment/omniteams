function wineGlassAuth(config){
	return new Promise((resolveAuth, rejectAuth) => {
		try{
			var IFRAME_URL = config.xdSourceURL;
			var LOGIN_REDIRECT_URL = config.loginRedirectURL;
			var loginWindow = null;
			login().then(resolveAuth).catch(err => {
				loginWindow = window.open(LOGIN_REDIRECT_URL);
				var popup = loginWindow;
				if(!popup || popup.closed || typeof popup.closed == 'undefined'){
					rejectAuth({
						type: 'POPUP_BLOCKED',
						message: 'Login failed. Allow pop-ups and reload the page.'
					});
				}
				recursiveLoginCheck(resolveAuth);
			});
			function login(){
				return new Promise((resolve, reject) => {
					function xdLoginCallback(){
						xdLocalStorage.getItem(config.localStorageTag, uid => {
							if(uid.value){
								if(uid.value !== '[Object object]'){
									resolve(uid.value);
								}
								reject('Not logged in.');
							}
							else{
								reject('Not logged in.');
							}
						});
					}
					if(xdLocalStorage.wasInit()){
						xdLoginCallback();
					}
					else{
						xdLocalStorage.init({
							iframeUrl: IFRAME_URL,
							initCallback: () => {
								xdLoginCallback();
							}
						});
					}
				});
			}
			function recursiveLoginCheck(callback){
				login().then(uid => {
					loginWindow.close();
					callback(uid);
				}).catch(err => {
					recursiveLoginCheck(callback);
				});
			}
		}
		catch(err){
			rejectAuth(err);
		}
	});
}
