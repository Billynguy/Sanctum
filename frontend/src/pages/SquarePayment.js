import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { useParams } from 'react-router-dom';
import "../styles/square.css";

const paymentUrl = "http://127.0.0.1:5000/payment";
const downloadUrl = "http://127.0.0.1:5000/download";

export default function Home() {
  const { id, uploadedBy } = useParams();
  const productId = uploadedBy + '-' + id + '.zip';
  return (
    <div className="container">
      <PaymentForm
        applicationId="sandbox-sq0idb-4ALt1NBlqojNC82cYmfPug"
        cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
          const response = await fetch(paymentUrl, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              sourceId: token.token,
              productId: productId
            }),
          });
          const json = await response.json();
          if (response.status === 200) {
            console.log(json);
            window.close();
          } else
            console.log(json.error);
        }}
        locationId='L734436KWRBEB'
      >
        <CreditCard />
      </PaymentForm>
    </div>
  )
}
