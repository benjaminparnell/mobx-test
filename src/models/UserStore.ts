import { types, SnapshotOut, Instance } from 'mobx-state-tree'

const User = types.model({
    firstName: types.string,
    lastName: types.string,
    email: types.string
}).views((self) => ({
    // This is equivalent to a selector in redux
    get fullName() {
        return self.firstName + ' ' + self.lastName
    }
})).actions((self) => ({
    // This is like an action in redux, but instead of dispatching anything it does the reducer part of redux too.
    // No need to worry about returning a "new" copy of the object
    changeName(firstName: string) {
        self.firstName = firstName
    }
}))

export default User

// The SnapshotOut type gives you the actual type defined by types.model, without any of the other store stuff
// like methods and views etc
export type UserType = SnapshotOut<typeof User>

// The Instance type is the type of a single instance of the model defined above, with all the stuff like methods
export type UserModelType = Instance<typeof User>