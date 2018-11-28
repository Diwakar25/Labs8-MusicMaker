//
//  SideMenuViewController.swift
//  MusicMaker
//
//  Created by Vuk Radosavljevic on 11/14/18.
//  Copyright © 2018 Vuk. All rights reserved.
//

import UIKit
import FirebaseAuth
import GoogleSignIn

class SideMenuViewController: UIViewController {

    
    // MARK: - Delegate
    weak var delegate: SideMenuDelegate?
    
    
    // MARK: - IBOutlets
    @IBOutlet weak var profileButton: UIButton! {
        didSet {
            profileButton.centerVertically()
        }
    }
    @IBOutlet weak var assignmentsButton: UIButton! {
        didSet {
            assignmentsButton.centerVertically()
        }
    }
    @IBOutlet weak var settingsButton: UIButton! {
        didSet {
            settingsButton.centerVertically()

        }
    }
    @IBOutlet weak var resetPasswordButton: UIButton! {
        didSet {
            resetPasswordButton.centerVertically()
            resetPasswordButton.titleLabel?.textAlignment = .center
        }
    }
    @IBOutlet weak var logoutButton: UIButton! {
        didSet {
            logoutButton.centerVertically()
        }
    }
    
    
    // MARK: - IBActions
    
    @IBAction func showUserProfile(_ sender: Any) {
        delegate?.userProfileClicked()
    }
    
    @IBAction func logoutUser(_ sender: Any) {
        do {
            try Auth.auth().signOut()
            GIDSignIn.sharedInstance().signOut()
            let storyboard = UIStoryboard(name: "Authentication", bundle: nil)
            let initialVC = storyboard.instantiateViewController(withIdentifier: "FirstNavController")
            self.present(initialVC, animated: true, completion: nil)
        } catch {
            //Update UI to let them know it couldn't sign them out
            print(error)
        }
    }
}