import * as Appwrite from "appwrite";

var appwrite = new Appwrite();

appwrite
    .setEndpoint('https://localhost:4003/v1')
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_KEY)
;

export default appwrite;