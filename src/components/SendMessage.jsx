import PropTypes from 'prop-types';
import WhatsApp from './WhatsApp';
import { ToastContainer } from 'react-toastify';
const SendMessage = ({ senderNumber, recieverNumber, Message }) => {
  // Initialize WhatsApp SDK with the sender's phone number
  const wa = new WhatsApp(senderNumber);
  const sdk_version = wa.version();

  // Enter the recipient phone number
  const recipient_number = recieverNumber;

  async function send_message() {
    console.log(sdk_version);
    try {
      const sent_text_message = wa.messages.text({ body: Message }, recipient_number);

      await sent_text_message.then((res) => {
        console.log(res.rawResponse());

      });
    } catch (e) {
      // Enhanced error handling
      if (e.response) {
        // Server responded with a status other than 200 range
        console.error('Error response from server:', e.response.data);
      } else if (e.request) {
        // Request was made but no response was received
        console.error('No response received:', e.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error setting up request:', e.message);
      }
      console.error('Error details:', JSON.stringify(e));
    }
  }

  // Call the send_message function to send the message
  send_message();

  return null; // Return null as this component does not render anything
};

SendMessage.propTypes = {
  senderNumber: PropTypes.string.isRequired,
  recieverNumber: PropTypes.string.isRequired,
  Message: PropTypes.string.isRequired,
};

export default SendMessage;