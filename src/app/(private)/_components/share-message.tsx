import { Modal } from "antd";
import React from "react";
import {
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";

function ShareMessage({
  open,
  setOpen,
  messageToShare,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  messageToShare: string;
}) {
  const shareUrl = `https://yourapp.com/post/${messageToShare}`;

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Share Message"
      centered
      footer={null}
    >
      <div className="flex gap-5">
        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <LinkedinShareButton url={shareUrl}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <TwitterShareButton url={shareUrl}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>
    </Modal>
  );
}

export default ShareMessage;
