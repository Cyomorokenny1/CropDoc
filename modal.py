import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import pathlib

# Load dataset
data_dir = pathlib.Path("dataset")
img_size = (224, 224)
batch_size = 32

train_ds = tf.keras.utils.image_dataset_from_directory(
    data_dir,
    image_size=img_size,
    batch_size=batch_size
)

# Normalize
train_ds = train_ds.map(lambda x, y: (x/255.0, y))

# Build model
model = keras.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)),
    layers.MaxPooling2D(),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(2, activation='softmax')  # 2 classes
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train
model.fit(train_ds, epochs=5)

# Save
model.save("leaf_model.h5")
