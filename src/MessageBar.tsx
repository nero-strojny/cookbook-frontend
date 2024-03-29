import React, {useContext} from "react";
import {Message, Sticky, Transition} from "semantic-ui-react";
import {ServerRequestContext} from "./context/ServerRequestContext";

const MessageBar = (): JSX.Element => {
  const {state, dispatch} = useContext(ServerRequestContext);
  const {header, messageContent} = state;
  return (
    <Sticky>
      <Transition visible={Boolean(messageContent)} animation="scale" duration={500}>
        <Message
          onDismiss={() => dispatch({type: 'CLEAR_MESSAGE', payload: {}})}
          header={header}
          content={messageContent}
        />
      </Transition>
    </Sticky>
  );
}

export default MessageBar;
