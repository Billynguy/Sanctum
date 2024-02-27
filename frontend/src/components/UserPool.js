import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-2_Sox2sJQM6",
    ClientId: "1sa9b5grgrh70q69k5k822hb3s"
}

export default new CognitoUserPool(poolData);