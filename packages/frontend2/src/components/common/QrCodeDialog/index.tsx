import {
      Dialog,
      DialogActions,
      DialogContent,
      DialogContentText,
      DialogTitle
} from '@mui/material';
import QRCode from 'qrcode.react';
import './QrCodeDialog.css';

/**
 * QrCodeDialogコンポーネント
 * @param props 引数
 */
const QrCodeDialog = (props:any) => {
      // 引数から値を取得する。
      const { 
            open, 
            did,
            handleClose, 
      } = props;

      return (
            <>
                  <Dialog 
                        open={open} 
                        onClose={handleClose} 
                        aria-labelledby="form-dialog-title"
                  >
                        <DialogTitle id="form-dialog-title">
                              My DID 
                        </DialogTitle>
                        <DialogContent >
                              <DialogContentText>
                                    <QRCode value={did} />
                              </DialogContentText>
                        </DialogContent>
                        <DialogActions></DialogActions>
                  </Dialog>
            </>
      );
};

export default QrCodeDialog;