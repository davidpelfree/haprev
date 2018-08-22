import * as firebase from 'firebase';
import { Permissions, Notifications } from 'expo';

export const registerForPushNotificationsAsync= async() => {
  settings = {}
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  // only ask if permissions have not already been determined, because iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted')
    settings['token'] = ''
  else{
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    settings['token'] = token
    sendPushNotification(token,'עדכון' ,'נרשמת בהצלחה לקבלת עדכונים')
  }
  settings['status'] = finalStatus
  return settings;
}

export const sendPushNotification = (token, title, body) => {
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: { message: `${title} - ${body}` },
        sound: "default",
        icon: "../../images/haprevLogo.png",
        android:{
          icon: "../../images/haprevLogo.png",
          sound:"default"
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
}

export const getUserTokenNotification = async(userId) =>{
  let ref = firebase.database().ref('users/'+userId+'/settings')
  let userToken = false
  await ref.once('value', 
    snapshot => {
      let settingsRes = snapshot.val()
      if (settingsRes && settingsRes.token !=='')
        userToken = settingsRes.token
    })
    .catch(error => {console.log('Error ' + error);})
  return userToken
}