import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import {API_ROOT, GEO_OPTIONS, AUTH_PREFIX, TOKEN_KEY} from "../constants"
import $ from 'jquery';

const TabPane = Tabs.TabPane;

export class Home extends React.Component {

    state = {
        loadingGeoLocation: false,
        error: '',
    }

    getGeoLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            );
        } else {
            /*geolocaiton IS NOT available*/
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        //const {latitude, longitude} = position.coords;
        this.setState({ loadingGeoLocation: false, error: '' });
        const lat = 37.7915953; 
        const lon = -122.3937977;
        localStorage.setItem('POS_KEY', JSON.stringify({ lat, lon }));
        this.loadNearbyPosts(position);
    }

    onFailedLoadGeolocation = () => {
        this.setState({ loadingGeoLocation: false, error: 'Fail to load geo location!'});
        console.log('fail to get geolocaiton')
    }

    componentDidMount() {
        this.setState({ loadingGeoLocation: true });
        this.getGeoLocation();
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading..."/>
        } else {
            return <div>content</div>
        }
    }

    loadNearbyPosts = (position) => {
        const lat = 37.7915953; 
        const lon = -122.3937977;
        $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            }
        }).then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        const operations = <Button type="primary">Create New Post</Button>;
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">Map</TabPane>
            </Tabs>
        );
    }
}