import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { API_ROOT, GEO_OPTIONS, AUTH_PREFIX, TOKEN_KEY, POS_KEY } from "../constants";
import $ from 'jquery';
import { Gallery } from './Gallary';
import { CreatePostButton } from "./CreatePostButton";
import { WrapAroundMap} from "./AroundMap";

const TabPane = Tabs.TabPane;

export class Home extends React.Component {

    state = {
        loadingPosts: false,
        loadingGeoLocation: false,
        error: '',
        posts: [],
    }

    getGeoLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            );
            } else {
            this.setState({ error: 'Your browser does not support geolocation!'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        //const {latitude, longitude} = position.coords;
        this.setState({ loadingGeoLocation: false, error: '' });
        const { latitude: lat, longitude: lon } = position.coords;
        const location = { lat: lat, lon: lon };
        localStorage.setItem(POS_KEY, JSON.stringify(location));
        this.loadNearbyPosts(location);
    }

    onFailedLoadGeolocation = () => {
        this.setState({ loadingGeoLocation: false, error: 'Fail to load geo location!'});
        console.log('Fail to get geolocaiton')
    }

    componentDidMount() {
        this.setState({ loadingGeoLocation: true });
        this.getGeoLocation();
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading Geolocation"/>
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading Posts..."/>
        } else if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
            return <Gallery images={images}/>;
        } else{
            return <div>content</div>
        }
    }

    loadNearbyPosts = (location, radius) => {
        const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        this.setState({ loadingPosts: true });
        return (
            $.ajax({
                url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
                method: 'GET',
                headers: {
                    Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
                }
            }).then((response) => {
                console.log(response);
                this.setState({ posts: response, loadingPosts: false, error: '' });
            }, (error) => {
                console.log(error);
                this.setState({ loadingPosts: false, error: error.responseText });
            }).catch((error) => {
                console.log(error);
            })
        );
    }


    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrapAroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </TabPane>
            </Tabs>
        );
    }
}