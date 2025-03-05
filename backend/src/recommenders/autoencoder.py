import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, LeakyReLU, Dropout
from tensorflow.keras.optimizers import Adam
from typing import Tuple
import joblib


def load_and_preprocess_data(
    filepath: str,
) -> Tuple[pd.DataFrame, np.ndarray, MinMaxScaler]:
    """Load and preprocess the dataset."""
    data = pd.read_csv(filepath)
    selected_columns = [
        "Calories",
        "FatContent",
        "SaturatedFatContent",
        "CholesterolContent",
        "SodiumContent",
        "CarbohydrateContent",
        "FiberContent",
        "SugarContent",
        "ProteinContent",
    ]
    df = data[selected_columns]

    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(df)

    return data, X_scaled, scaler


def train_autoencoder(X_scaled: np.ndarray) -> Sequential:
    """Train an autoencoder model."""
    num_features = X_scaled.shape[1]
    model = Sequential(
        [
            # Encoder
            Dense(256, input_shape=(num_features,)),
            LeakyReLU(),
            Dropout(0.2),
            Dense(128),
            LeakyReLU(),
            Dropout(0.2),
            Dense(64),
            LeakyReLU(),
            Dropout(0.2),

            # Bottleneck
            Dense(32),
            # The bottleneck layer reduces the dimensionality of the input data, capturing essential features

            # Decoder
            Dense(64),
            LeakyReLU(),
            Dropout(0.2),
            Dense(128),
            LeakyReLU(),
            Dropout(0.2),
            Dense(256),
            LeakyReLU(),
            Dense(num_features, activation="linear"),
        ]
    )

    optimizer = Adam(learning_rate=0.0001)
    model.compile(optimizer=optimizer, loss="mse", metrics=["mae"])

    checkpoint_filepath = '.models/ckpt/checkpoint.model.keras'
    model_checkpoint_callback = ModelCheckpoint(
        filepath=checkpoint_filepath,
        monitor='val_loss',
        mode='min',
        save_best_only=True)

    X_train, X_eval = train_test_split(X_scaled, train_size=0.8, random_state=42)
    model.fit(
        X_train,
        X_train,
        validation_data=(X_eval, X_eval),
        epochs=100,
        callbacks=[model_checkpoint_callback],
    )

    return model


def save_model(model: Sequential, scaler: MinMaxScaler, model_path: str = "models/autoencoder_model.keras", scaler_path: str = "scaler.pkl") -> None:
    model.save(model_path)
    joblib.dump(scaler, scaler_path)


def load_trained_model(model_path: str = "models/autoencoder_model.keras", scaler_path: str = "scaler.pkl") -> Tuple[Sequential, MinMaxScaler]:
    model = load_model(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler


if __name__ == "__main__":
    data_path = "./data/recipes.csv"
    data, X_scaled, scaler = load_and_preprocess_data(data_path)
    model = train_autoencoder(X_scaled)
    save_model(model, scaler)

    model, scaler = load_trained_model()
    print(model.summary())

    # Generate recipe recommendations
    recipes_df = data.copy()
    x_test = X_scaled[0].reshape(1, -1)
    predictions = model.predict(x_test)
    decoded_predictions = scaler.inverse_transform(predictions)
    recommended_recipe = recipes_df.iloc[np.argmax(decoded_predictions)]
    print(recommended_recipe)

    

