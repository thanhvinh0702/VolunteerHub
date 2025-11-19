import React from "react";
import { joinRequestsData } from "./joinRequestsData";
import ModalActivity from "../ModalActivity/ModalActivity";
import RequestCard from "./RequestCard";
function RequestCardOverview() {
  return (
    <div>
      <ModalActivity
        title="Join Requests"
        subtile="Join Requests"
        viewMore={true}
        path="/request-event-ad"
      >
        {joinRequestsData.map((item) => {
          return <RequestCard key={item.id} data={item} />;
        })}
      </ModalActivity>
    </div>
  );
}

export default RequestCardOverview;
