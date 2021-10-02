import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, SafeAreaView, Image, View} from 'react-native';
import API from '../services/api';

const Profile = ({navigation, route}) => {
  const [member, setMember] = useState({
    id: '',
    image_name: '',
    fullName: {th: '', en: ''},
  });

  useEffect(() => {
    fetchMember(id);
  }, [id]);

  const {id} = route.params;

  const fetchMember = async id => {
    let {data: memberInfo} = await API.members.byId(id);
    if (memberInfo) {
      let memberMap = {
        ...memberInfo,
        fullName: {
          th: `${memberInfo.firstname.th} ${memberInfo.lastname.th}(${memberInfo.nickname.th})`,
          en: `${memberInfo.firstname.en} ${memberInfo.lastname.en}(${memberInfo.nickname.en})`,
        },
      };
      setMember(memberMap);
    }
  };

  let details = [
    'birthDay',
    'height',
    'province',
    'hobbies',
    'likes',
    'instagram',
    'generation',
  ];

  const capChar = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: API.members.image_url(member.id, member.image_name)}}
          style={styles.avatar}
        />
        <View style={{marginVertical: 7, alignItems: 'center'}}>
          <Text style={styles.thName}>{member.fullName.th}</Text>
          <Text style={styles.enName}>{member.fullName.en}</Text>
        </View>
      </View>
      <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
        {details.map(d => (
          <View style={{marginVertical: 5}} key={d}>
            <Text style={styles.subtitle}>{capChar(d)}</Text>
            <Text style={styles.title}>{member[d]}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    display: 'flex',
  },
  title: {
    color: '#212121',
    fontSize: 14,
  },
  subtitle: {
    color: '#7d7d7d',
    fontSize: 12,
  },
  thName: {
    color: '#1a1a1a',
    fontSize: 15,
  },
  enName: {
    color: '#575757',
    fontSize: 13,
  },
});

export default Profile;
