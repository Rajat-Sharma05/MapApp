import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, TextInput, Alert } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '../../config/mapboxConfig';
import { auth, firestore } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../Components/AppButton';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
}

const MapScreen = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [tempMarker, setTempMarker] = useState<Marker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const navigation = useNavigation();
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('locations')
      .where('userId', '==', user.uid)
      .onSnapshot(snapshot => {
        const fetchedMarkers: Marker[] = snapshot.docs.map(doc => ({
          id: doc.id,
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
          title: doc.data().title,
        }));
        setMarkers(fetchedMarkers);
      });

    return () => unsubscribe();
  }, [user]);

  const saveMarker = async () => {
    if (!tempMarker || !user) return;

    try {
      await firestore().collection('locations').add({
        latitude: tempMarker.latitude,
        longitude: tempMarker.longitude,
        title: 'New Marker',
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setTempMarker(null);
    } catch (err) {
      console.log('Firestore create error:', err);
    }
  };

  const handleMapPress = (e: any) => {
    const [longitude, latitude] = e.geometry.coordinates;
    setTempMarker({ id: 'temp', latitude, longitude });
  };

  const handleMarkerTap = (marker: Marker) => {
    setSelectedMarker(marker);
    setNewTitle(marker.title || '');
  };

  const updateMarker = async () => {
    if (!selectedMarker) return;

    try {
      await firestore().collection('locations').doc(selectedMarker.id).update({
        title: newTitle,
        latitude: selectedMarker.latitude,
        longitude: selectedMarker.longitude,
      });

      setSelectedMarker(null);
    } catch (err) {
      console.log('Firestore update error:', err);
    }
  };

  const deleteMarker = async () => {
    if (!selectedMarker) return;

    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('locations')
                .doc(selectedMarker.id)
                .delete();
              setSelectedMarker(null);
            } catch (err) {
              console.log('Firestore delete error:', err);
            }
          },
        },
      ],
    );
  };

  const logout = async () => {
    try {
      await auth().signOut();
      navigation.replace('LoginScreen');
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} onPress={handleMapPress}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[76.692062, 30.707757]}
        />

        {markers.map(marker => (
          <MapboxGL.PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={[marker.longitude, marker.latitude]}
            onSelected={() => handleMarkerTap(marker)}
          />
        ))}

        {tempMarker && (
          <MapboxGL.PointAnnotation
            key={tempMarker.id}
            id={tempMarker.id}
            coordinate={[tempMarker.longitude, tempMarker.latitude]}
          />
        )}
      </MapboxGL.MapView>

      {tempMarker && (
        <View style={styles.saveContainer}>
          <Text style={styles.saveText}>
            Lat: {tempMarker.latitude.toFixed(5)} | Lng:{' '}
            {tempMarker.longitude.toFixed(5)}
          </Text>

          <AppButton title="Save Location" onPress={saveMarker} />
        </View>
      )}

      {selectedMarker && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Marker</Text>

          <Text style={styles.label}>Latitude</Text>
          <Text style={styles.value}>{selectedMarker.latitude.toFixed(5)}</Text>

          <Text style={styles.label}>Longitude</Text>
          <Text style={styles.value}>
            {selectedMarker.longitude.toFixed(5)}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Marker Title"
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <AppButton title="Update" onPress={updateMarker} />
          <AppButton title="Delete" onPress={deleteMarker} type="danger" />
          <AppButton
            title="Cancel"
            onPress={() => setSelectedMarker(null)}
            type="secondary"
          />
        </View>
      )}

      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },
  map: { 
    flex: 1
  },
  saveContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    elevation: 4,
  },
  saveText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalContainer: {
    position: 'absolute',
    top: 250,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 10,
    marginVertical: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#111827',
  },
  logoutContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});