import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default function User({ navigation }) {
    const [stars, setStars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const user = navigation.getParam('user');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData(page = 1) {
        setLoading(true);
        const response = await api.get(
            `/users/${user.login}/starred?page=${page}`
        );
        setStars(page >= 2 ? [...stars, response.data] : response.data);
        setLoading(false);
        setRefreshing(false);
    }

    function loadMore() {
        const nextPage = page + 1;
        loadData(nextPage);
    }

    function refreshList() {
        setRefreshing(true);
        setStars([]);
        loadData();
    }

    return (
        <Container>
            <Header>
                <Avatar source={{ uri: user.avatar }} />
                <Name>{user.name}</Name>
                <Bio>{user.bio}</Bio>
            </Header>
            {loading ? (
                <ActivityIndicator color="#7159c1" />
            ) : (
                <Stars
                    data={stars}
                    keyExtractor={star => String(star.id)}
                    onEndReachedThreshold={0.2}
                    onEndReached={loadMore}
                    onRefresh={refreshList}
                    refreshing={refreshing}
                    renderItem={({ item }) => (
                        <Starred>
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
            )}
        </Container>
    );
}

User.navigationOptions = ({ navigation }) => {
    return {
        title: navigation.getParam('user').name,
        headerTitleAlign: 'center',
    };
};

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
    }).isRequired,
};
