import React from "react";
import "./CardContainer.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

export default function CardContainer({ children, page }) {
  return (
    <Card>
      <CardContent>
        <Box className="CardContainer-Box">
          <Typography variant="h4">Conflux Contact Tracing</Typography>
          <Box className="CardContainer-SubBox">{children}</Box>
        </Box>
      </CardContent>
      <CardActions className="CardContainer-Buttons">
        <IconButton
          // disabled={page.state === 0 || page.state === 1}
          onClick={() => page.set(page.state - 1)}
          color="primary"
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          // disabled={page.state === 0 || page.state === 2}
          onClick={() => page.set(page.state + 1)}
          color="primary"
        >
          <ChevronRightIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
