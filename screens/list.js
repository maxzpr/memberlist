import React, {useState, useEffect} from 'react';
import API from '../services/api';
import {Picker} from '@react-native-picker/picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSortAmountDown,
  faSortAmountUp,
} from '@fortawesome/free-solid-svg-icons';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const MemberCard = ({member, onPress}) => {
  const {firstname, lastname, nickname} = member;

  return (
    <TouchableOpacity onPress={() => onPress(member)} key={member.id}>
      <View style={styles.card}>
        <View style={{width: '20%'}}>
          <Image
            style={styles.avatar}
            source={{uri: API.members.image_url(member.id, member.image_name)}}
          />
        </View>
        <View style={styles.detail}>
          <Text>{`${firstname.th} ${lastname.th} (${nickname.th})`}</Text>
          <Text>{`${firstname.en} ${lastname.en} (${nickname.en})`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Filter = ({provinces, generations, filter, onSelectFilter}) => {
  return (
    <View style={{...styles.row, paddingHorizontal: 15, paddingVertical: 10}}>
      <View style={{width: '50%', paddingHorizontal: 5}}>
        <Text style={{paddingLeft: 5}}>รุ่น</Text>
        <View style={styles.selectBox}>
          <Picker
            selectedValue={filter.generation}
            onValueChange={select => onSelectFilter('generation', select)}>
            {generations.map(g => (
              <Picker.Item label={g} value={g} key={g} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={{width: '50%', paddingHorizontal: 5}}>
        <Text style={{paddingLeft: 5}}>จังหวัด</Text>
        <View style={styles.selectBox}>
          <Picker
            selectedValue={filter.province}
            onValueChange={select => onSelectFilter('province', select)}>
            {provinces.map(p => (
              <Picker.Item label={p.label} value={p.value} key={p.value} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const SearchBox = ({search, onFilter}) => {
  return (
    <View style={styles.searchText}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={text => onFilter('search', text.toLowerCase())}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="ค้นหา"
      />
    </View>
  );
};

const List = ({navigation}) => {
  const [members, setMembers] = useState({
    list: [],
    filterList: [],
    generations: [],
    provinces: [],
  });
  const [filter, setFilter] = useState({
    generation: null,
    province: null,
    search: '',
  });

  const [sort, setSort] = useState({by: '', asc: true});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    let {data: memberList} = await API.members.list();
    if (memberList.length) {
      let generations = [];
      let provinces = [
        {label: 'กรุงเทพ', value: 'Bangkok'},
        {label: 'ต่างจังหวัด', value: ''},
      ];

      memberList.forEach(member => {
        if (!generations.includes(member.generation)) {
          generations.push(member.generation);
        }

        member.fullNameTH = `${member.firstname.th} ${member.lastname.th}`;
        member.fullNameEN = `${member.firstname.en} ${member.lastname.en}`;
        member.nickNameTH = `${member.nickname.th}`;
        member.nickNameEN = `${member.nickname.en}`;
      });

      setMembers({
        list: memberList,
        filterList: [],
        generations: generations.sort(),
        provinces,
      });
    }
  };

  const onSelectMember = member => {
    console.log('onSelectMember');
    navigation.navigate('Profile', {
      id: member.id,
    });
  };

  const onFilter = (type, value) => {
    setMembers({filterList: []});
    searchByfilter({type, value});
  };

  const searchByfilter = ({type, value}) => {
    let newFilter = {...filter, [type]: value};

    setFilter(newFilter);

    if (newFilter.search || newFilter.generation || newFilter.province) {
      let newList = members.list.filter(member => {
        let textSearch = true;
        let generationSearch = true;
        let provinceSearch = true;

        if (newFilter.search) {
          textSearch =
            member.firstname.th.toLowerCase().includes(newFilter.search) ||
            member.lastname.th.toLowerCase().includes(newFilter.search) ||
            member.nickname.th.toLowerCase().includes(newFilter.search) ||
            member.firstname.en.toLowerCase().includes(newFilter.search) ||
            member.nickname.en.toLowerCase().includes(newFilter.search) ||
            member.lastname.en.toLowerCase().includes(newFilter.search);
        }

        if (newFilter.generation) {
          generationSearch = member.generation === newFilter.generation;
        }

        if (member.province === 'Bangkok') {
          provinceSearch = newFilter.province === 'Bangkok';
        }

        return textSearch && generationSearch && provinceSearch;
      });

      setMembers({...members, filterList: newList});
    } else {
      setMembers({...members, filterList: members.list});
    }
  };

  const sortFilter = ({by, asc}) => {
    setSort({by, asc});
    let newList = members.filterList.sort((a, b) => {
      if (asc) {
        return a[by] > b[by] ? 1 : -1;
      } else {
        return a[by] < b[by] ? 1 : -1;
      }
    });
    setMembers({...members, filterList: newList});
  };

  const sortKeys = [
    {label: 'ชื่อ-นามสกุล(ไทย)', key: 'fullNameTH'},
    {label: 'ชื่อ-นามสกุล(อังกฤษ)', key: 'fullNameEN'},
    {label: 'ชื่อเล่น(ไทย)', key: 'nickNameTH'},
    {label: 'ชื่อเล่น(อังกฤษ)', key: 'nickNameEN'},
    {label: 'วันเกิด', key: 'birthDay'},
    {label: 'รุ่น', key: 'generation'},
    {label: 'ส่วนสูง', key: 'height'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <SearchBox search={filter.search} onFilter={onFilter} />
      <Filter
        filter={filter}
        onSelectFilter={onFilter}
        provinces={members.provinces}
        generations={members.generations}
      />
      <View style={{...styles.row, paddingHorizontal: 10, paddingVertical: 5}}>
        <View style={{width: '85%', paddingHorizontal: 5}}>
          <Text style={{paddingLeft: 5}}>เรียงตาม</Text>
          <View style={styles.selectBox}>
            <Picker
              selectedValue={sort.by}
              onValueChange={key => sortFilter({...sort, by: key})}>
              {sortKeys.map(s => (
                <Picker.Item label={s.label} value={s.key} key={s.key} />
              ))}
            </Picker>
          </View>
        </View>
        <View
          style={{
            width: '15%',
            paddingTop: 30,
            paddingLeft: 10,
          }}>
          <TouchableOpacity
            onPress={() => sortFilter({...sort, asc: !sort.asc})}>
            <FontAwesomeIcon
              icon={!sort.asc ? faSortAmountDown : faSortAmountUp}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <FlatList
          data={members.filterList}
          renderItem={({item}) => (
            <MemberCard member={item} onPress={onSelectMember} key={item.id} />
          )}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    marginHorizontal: 15,
  },
  text: {
    fontSize: 12,
  },
  list: {
    marginVertical: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignContent: 'center',
    overflow: 'hidden',
  },
  detail: {
    width: '80%',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: 'black',
    marginVertical: 5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  searchText: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  selectBox: {
    backgroundColor: 'white',
    borderRadius: 30,
  },
});

export default List;
