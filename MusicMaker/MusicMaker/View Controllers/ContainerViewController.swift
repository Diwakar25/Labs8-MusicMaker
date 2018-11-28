//
//  ContainerViewController.swift
//  MusicMaker
//
//  Created by Vuk Radosavljevic on 11/14/18.
//  Copyright © 2018 Vuk. All rights reserved.
//

import UIKit

class ContainerViewController: UIViewController {

    
    // MARK: - Properties
    var teachersViewController: TeachersViewController!
    var sideMenuViewController: SideMenuViewController!

    
    // MARK: - IBOutlets
    @IBOutlet weak var sideMenu: UIView!
    @IBOutlet weak var teachersView: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.sideMenu.transform = CGAffineTransform(translationX: -self.sideMenu.frame.width, y: 0)
        self.sideMenu.layer.shadowOpacity = 0.8
        self.sideMenu.alpha = 1
        self.view.bringSubviewToFront(sideMenu)
        sideMenuViewController = self.children[0] as? SideMenuViewController
        teachersViewController =  self.children[1].children[0] as? TeachersViewController
        teachersViewController.delegate = self
        sideMenuViewController.delegate = self
    }
    
    private func hideSideMenu() {
        UIView.animate(withDuration: 0.4, delay: 0, options: [], animations: {
            self.sideMenu.transform = CGAffineTransform(translationX: -self.sideMenu.frame.width, y: 0)
            self.teachersView.transform = .identity
        })
    }
    
    private func showSideMenu() {
        UIView.animate(withDuration: 0.4, delay: 0, options: [], animations: {
            self.sideMenu.transform = .identity
            self.teachersView.transform = CGAffineTransform(translationX: self.sideMenu.frame.width, y: 0)
        })
    }
    

}

// MARK: - TeachersViewControllerDelegate
extension ContainerViewController: TeachersViewControllerDelegate {
    func menuButtonTapped() {
        teachersViewController.sideMenuIsShowing ? hideSideMenu() : showSideMenu()
    }
}

// MARK: - SideMenuDelegate
extension ContainerViewController: SideMenuDelegate {
    func userProfileClicked() {
        self.performSegue(withIdentifier: "ShowUserProfile", sender: nil)
    }
}


