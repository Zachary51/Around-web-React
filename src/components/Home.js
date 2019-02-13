import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from
      '../constants';


const TabPane = Tabs.TabPane;

export class Home extends React.Component {
  state = {
    isLoadingGeoLocation: false,
    error: '',
    isLoadingPosts: false,
    posts: [],
  }

  componentDidMount() {
    if("geolocation" in navigator) {
      this.setState({ isLoadingGeoLocation: true, error: ''});
      navigator.geolocation.getCurrentPosition(
          this.onSuccessLoadGeoLocation,
          this.onFailedLoadGeoLocation,
          GEO_OPTIONS);
    } else {
      this.setState({ error: 'Geolocation is not supported.'});
    }
  }

  onSuccessLoadGeoLocation = (position) => {
    console.log(position);
    const { latitude, longitude } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
    this.setState({ isLoadingGeoLocation: false });
    this.loadNearbyPosts();
  }

  onFailedLoadGeoLocation = () => {
    this.setState({ isLoadingGeoLocation: false, error: 'Failed to load geolocation.' });
  }

  getImagePosts = () => {
    const { error, isLoadingGeoLocation, isLoadingPosts, posts } = this.state;
    if (error) {
      return <div>{error}</div>
    } else if(isLoadingGeoLocation) {
      return <Spin tip="Loading geo location..."/>
    } else if (isLoadingPosts) {
      return <Spin tip="Loading posts..." />
    } else if (posts.length > 0) {
      const images = this.state.posts.map((post) => {
        return {
          user: post.user,
          src: post.url,
          thumbnail: post.url,
          caption: post.message,
          thumbnailWidth: 400,
          thumbnailHeight: 300,
        }
      });

      return (<Gallery images={images}/>);
    } else {
      return 'No nearby posts.';
    }
  }


  render() {
    const operations = <Button type="primary">Create New Post</Button>;
    return (
        <Tabs tabBarExtraContent={operations} className="main-tabs">
          <TabPane tab="Image Posts" key="1">
            {this.getImagePosts()}
          </TabPane>
          <TabPane tab="Video Posts" key="2">Content of tab 2</TabPane>
          <TabPane tab="Map" key="3">Content of tab 3</TabPane>
        </Tabs>
    );
  }
}
