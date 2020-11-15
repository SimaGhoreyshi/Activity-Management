import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Segment, Image } from "semantic-ui-react";

export const HomePage = () => {
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          SimsimBook
        </Header>
        <Header as="h2" inverted content="Welcome to SimsimBook" />
        <Button as={Link} to="/activities" size="huge" inverted>
          Take me to the activities!
        </Button>
      </Container>
    </Segment>
  );
};
